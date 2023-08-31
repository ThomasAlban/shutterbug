import {
	Prisma,
	PrismaClient,
	type User,
	type Friend,
	type Theme,
	type Photo
} from '@prisma/client';

import bcrypt from 'bcrypt';
import { ImgurClient } from 'imgur';
import { IMGUR_CLIENT_ID } from '$env/static/private';
import { error } from '@sveltejs/kit';

// set the prisma variable to the global variable 'prisma' if it exists, if not make a new PrismaClient
const db = global.db || new PrismaClient();

// when in development mode and changes are made SvelteKit refreshes itself. This prevents a new PrismaClient being made in that case
if (process.env.NODE_ENV === 'development') global.db = db;

export default db;

type ClientUser = {
	userID: string;
	username: string;
	dateCreated: Date;
	profilePhoto: string | null;
};
type Vote = {
	humour: number;
	creativity: number;
	photography: number;
};
type FriendStatus = 'friends' | 'outgoingRequest' | 'incomingRequest' | 'none';

const toClientUser = ({ userID, username, dateCreated, profilePhoto }: User): ClientUser => ({
	userID,
	username,
	dateCreated,
	profilePhoto
});
const toPhoto = ({ userID, themeID, photo, dateCreated }: Photo): Photo => ({
	userID,
	themeID,
	photo,
	dateCreated
});

export async function createUser(username: string, password: string) {
	try {
		await db.user.create({
			data: {
				username,
				// store in the database a hashed version of their password
				password: await bcrypt.hash(password, 10)
			}
		});
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function sendFriendRequest(userID: string, friendID: string) {
	if (userID === friendID) return { success: false, error: 'userID and friendID are equal' };
	try {
		await db.friend.create({
			data: {
				requesterID: userID,
				requesteeID: friendID,
				accepted: false
			}
		});
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function acceptFriendRequest(userID: string, friendID: string) {
	try {
		const userIsRequester = await db.friend.findFirst({
			where: {
				requesterID: userID,
				requesteeID: friendID
			}
		});
		if (userIsRequester) {
			await db.friend.update({
				where: {
					requesterID_requesteeID: {
						requesterID: userID,
						requesteeID: friendID
					}
				},
				data: {
					accepted: true
				}
			});
			return;
		}

		const userIsRequestee = await db.friend.findFirst({
			where: {
				requesterID: friendID,
				requesteeID: userID
			}
		});
		if (userIsRequestee) {
			await db.friend.update({
				where: {
					requesterID_requesteeID: {
						requesterID: friendID,
						requesteeID: userID
					}
				},
				data: {
					accepted: true
				}
			});
			return;
		}
		throw error(500, {
			message: 'user trying to accept friend request was neither requester nor requestee'
		});
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function removeFriend(userID: string, friendID: string) {
	try {
		const userIsRequester = await db.friend.findFirst({
			where: {
				requesterID: userID,
				requesteeID: friendID
			}
		});
		if (userIsRequester) {
			await db.friend.delete({
				where: {
					requesterID_requesteeID: {
						requesterID: userID,
						requesteeID: friendID
					}
				}
			});
			return;
		}

		const userIsRequestee = await db.friend.findFirst({
			where: {
				requesterID: friendID,
				requesteeID: userID
			}
		});
		if (userIsRequestee) {
			await db.friend.delete({
				where: {
					requesterID_requesteeID: {
						requesterID: friendID,
						requesteeID: userID
					}
				}
			});
			return;
		}
		throw error(500, {
			message: 'user trying to remove friend was neither requester nor requestee'
		});
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function getAllFriendData(userID: string) {
	try {
		// get the currently logged-in user, and also find all their friends
		const user = await db.user.findUnique({
			where: { userID: userID },
			include: {
				friendRequestsSent: {
					include: { requestee: true }
				},
				friendRequestsReceived: {
					include: { requester: true }
				}
			}
		});
		if (!user) throw error(500, { message: 'no user' });

		const outgoingFriendRequests = user.friendRequestsSent
			.filter((request) => !request.accepted)
			.map((request) => toClientUser(request.requestee));

		const incomingFriendRequests = user.friendRequestsReceived
			.filter((request) => !request.accepted)
			.map((request) => toClientUser(request.requester));

		// make a list of all the user's friends
		const friends: ClientUser[] = [];
		// first go through all the friends where the user sent the request
		for (const request of user.friendRequestsSent) {
			if (request.accepted) friends.push(toClientUser(request.requestee));
		}
		// then go through all the friends where the friend sent the request
		for (const request of user.friendRequestsReceived) {
			if (request.accepted) friends.push(toClientUser(request.requester));
		}
		return { friends, outgoingFriendRequests, incomingFriendRequests };
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function getFriends(userID: string) {
	try {
		const user = await db.user.findUnique({
			where: { userID: userID },
			include: {
				friendRequestsSent: {
					where: { accepted: true },
					include: { requestee: true }
				},
				friendRequestsReceived: {
					where: { accepted: true },
					include: { requester: true }
				}
			}
		});
		if (!user) throw error(500, { message: 'no user' });

		// make a list of all the user's friends
		const friends: ClientUser[] = [];
		// first go through all the friends where the user sent the request
		for (const request of user.friendRequestsSent) {
			friends.push(toClientUser(request.requestee));
		}
		// then go through all the friends where the friend sent the request
		for (const request of user.friendRequestsReceived) {
			friends.push(toClientUser(request.requester));
		}
		return friends;
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function getFriendsWithSubmissions(userID: string, themeID: string) {
	try {
		const user = await db.user.findUnique({
			where: { userID: userID },
			include: {
				friendRequestsSent: {
					where: { accepted: true },
					include: { requestee: true }
				},
				friendRequestsReceived: {
					where: { accepted: true },
					include: { requester: true }
				},
				voter: { where: { themeID: themeID } }
			}
		});
		if (!user) throw error(500, { message: 'no user' });

		const friendsWithPhotos: {
			user: ClientUser;
			photoSubmission: string;
			vote: Vote | null;
		}[] = [];

		// first go through all the friends where the user sent the request
		for (const friend of user.friendRequestsSent) {
			if (!friend.accepted) continue;
			const photoSubmission = await db.photo.findUnique({
				where: {
					userID_themeID: {
						userID: friend.requesteeID,
						themeID: themeID
					},
					themeID: themeID
				}
			});
			if (!photoSubmission) continue;
			if (friend.requesteeID != user.userID)
				friendsWithPhotos.push({
					user: toClientUser(friend.requestee),
					photoSubmission: photoSubmission.photo,
					vote: null
				});
		}
		// then go through all the friends where the friend sent the request
		for (const friend of user.friendRequestsReceived) {
			if (!friend.accepted) continue;
			const photoSubmission = await db.photo.findUnique({
				where: {
					userID_themeID: {
						userID: friend.requesterID,
						themeID: themeID
					},
					themeID: themeID
				}
			});
			if (!photoSubmission) continue;
			if (friend.requesterID != user.userID)
				friendsWithPhotos.push({
					user: toClientUser(friend.requester),
					photoSubmission: photoSubmission.photo,
					vote: null
				});
		}

		// iterate through all the user's votes
		for (const vote of user.voter) {
			for (const friend of friendsWithPhotos) {
				if (friend.user.userID === vote.voteeID) {
					friend.vote = {
						humour: vote.voteHumour,
						creativity: vote.voteCreativity,
						photography: vote.votePhotography
					};
				}
			}
		}
		return friendsWithPhotos;
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function getCurrentTheme() {
	try {
		const currentDate = new Date();
		const theme = await db.theme.findFirst({
			where: {
				dateStart: {
					lt: currentDate
				},
				dateEnd: {
					gt: currentDate
				}
			}
		});
		return theme;
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function getPreviousTheme() {
	try {
		const currentDate = new Date();
		const theme = await db.theme.findFirst({
			where: {
				dateEnd: {
					lt: currentDate
				}
			},
			orderBy: {
				dateEnd: 'desc'
			}
		});
		return theme;
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function createVote(voterID: string, voteeID: string, themeID: string, vote: Vote) {
	if (
		vote.humour > 10 ||
		vote.humour < 0 ||
		vote.creativity > 10 ||
		vote.creativity < 0 ||
		vote.photography > 10 ||
		vote.photography < 0
	)
		throw error(500, { message: 'vote not within range' });

	try {
		const checkAlreadyVoted = await db.vote.findMany({
			where: {
				voterID: voterID,
				voteeID: voteeID,
				themeID: themeID
			}
		});

		if (checkAlreadyVoted.length > 0) throw error(500, { message: 'already voted' });

		await db.vote.create({
			data: {
				voterID: voterID,
				voteeID: voteeID,
				themeID: themeID,
				voteHumour: vote.humour,
				voteCreativity: vote.creativity,
				votePhotography: vote.photography
			}
		});
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function submitPhoto(img: File, userID: string, themeID: string) {
	// convert the image to a base64 string so that it can be uploaded
	const imgBase64 = Buffer.from(await img.arrayBuffer()).toString('base64');

	// create a new instance of the imgur client
	const imgurClient = new ImgurClient({
		clientId: IMGUR_CLIENT_ID
	});

	// upload the image to imgur
	const res = await imgurClient.upload({
		image: imgBase64,
		type: 'base64'
	});
	// validate to make sure the upload was successful
	if (!res.success) throw error(500, { message: 'could not upload image to imgur' });

	try {
		await db.photo.create({
			data: {
				// connect this entry with the current logged-in user
				user: {
					connect: { userID: userID }
				},
				// add the current theme
				theme: {
					connect: { themeID: themeID }
				},
				photo: res.data.link
			}
		});
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function userAlreadySubmittedPhoto(userID: string, themeID: string) {
	try {
		const count = await db.photo.count({
			where: { userID: userID, themeID: themeID }
		});
		return count != 0;
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function deleteReport(reporterID: string, culpritID: string) {
	try {
		await db.report.delete({
			where: {
				reporterID_culpritID: {
					reporterID,
					culpritID
				}
			}
		});
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function createTheme(theme: string, dateStart: Date, dateEnd: Date) {
	// validate the date input
	if (dateStart >= dateEnd) throw error(500, { message: 'date start greater than date end' });

	try {
		await db.theme.create({
			data: {
				theme,
				dateStart,
				dateEnd
			}
		});
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function searchUsersWithFriendStatus(
	searchQuery: string,
	userID: string,
	take: number
) {
	if (take < 1) throw error(500, { message: 'take is less than 1' });

	let query;
	try {
		query = await db.user.findMany({
			where: {
				username: { contains: searchQuery }
			},
			include: {
				friendRequestsReceived: true,
				friendRequestsSent: true
			},
			take: take
		});
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}

	const searchResult: {
		user: ClientUser;
		friendStatus: FriendStatus;
	}[] = [];

	for (const user of query) {
		if (user.userID === userID) continue;
		let friendStatus: FriendStatus = 'none';
		for (const friendRequestReceived of user.friendRequestsReceived) {
			if (friendRequestReceived.requesterID === userID) {
				if (friendRequestReceived.accepted) {
					friendStatus = 'friends';
				} else {
					friendStatus = 'outgoingRequest';
				}
				break;
			}
		}
		for (const friendRequestSent of user.friendRequestsSent) {
			if (friendRequestSent.requesteeID === userID) {
				if (friendRequestSent.accepted) {
					friendStatus = 'friends';
				} else {
					friendStatus = 'incomingRequest';
				}
				break;
			}
		}
		searchResult.push({
			user: toClientUser(user),
			friendStatus
		});
	}

	return searchResult;
}

export async function adminSearchUsersByUsername(searchQuery: string) {
	try {
		const searchResult = await db.user.findMany({
			where: {
				username: { contains: searchQuery }
			}
		});
		return searchResult;
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function adminSearchUsersByUserID(searchQuery: string) {
	try {
		const searchResult = await db.user.findMany({
			where: {
				userID: { contains: searchQuery }
			}
		});
		return searchResult;
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function adminGetUserWithReports(userID: string) {
	try {
		const user = await db.user.findUnique({
			// get the user from the database whose uuid is the same as the one in the url
			where: { userID: userID },
			// include that user's reports and who has reported them
			include: { reports: true, reportedBy: true }
		});
		return user;
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function userAdminToggle(userID: string) {
	try {
		const user = await db.user.findUnique({ where: { userID } });
		if (!user) throw error(500, { message: 'no user' });

		await db.user.update({
			where: { userID },
			data: {
				admin: !user.admin
			}
		});
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function deleteUser(userID: string) {
	try {
		await db.user.delete({ where: { userID } });
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function getUniqueUserByUsername(username: string) {
	try {
		const user = await db.user.findUnique({
			where: { username }
		});
		return user;
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function getAllReports() {
	try {
		const reports = await db.report.findMany();
		return reports;
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function getAllThemes() {
	try {
		const themes = await db.theme.findMany({
			orderBy: {
				dateEnd: 'desc'
			}
		});
		return themes;
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

export async function getClientUser(userID: string) {
	try {
		const user = await db.user.findUnique({
			where: { userID }
		});
		return user && toClientUser(user);
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}
}

type ClientUserFriendDataAndPhotos =
	| { user: ClientUser; friendStatus: 'none' | 'outgoingRequest' }
	| {
			user: ClientUser;
			photoSubmissions: { photo: Photo; theme: Theme }[];
			friendStatus: 'incomingRequest' | 'friends' | 'self';
	  };

export async function getClientUserFriendDataAndPhotos(
	userID: string,
	loggedInUserID: string
): Promise<ClientUserFriendDataAndPhotos> {
	let user;
	try {
		user = await db.user.findUnique({ where: { userID } });
	} catch (e) {
		throw error(500, { message: 'database error: ' + (e as string) });
	}

	if (!user) throw error(500, { message: 'user does not exist' });

	const getPhotoSubmissions = async () => {
		let photoSubmissionsQuery;
		try {
			photoSubmissionsQuery = await db.photo.findMany({
				where: { userID },
				include: { theme: true }
			});
		} catch (e) {
			throw error(500, { message: 'database error: ' + (e as string) });
		}
		const photoSubmissions = photoSubmissionsQuery.map((photo) => {
			return {
				photo: toPhoto(photo),
				theme: photo.theme
			};
		});
		return photoSubmissions;
	};

	// if the user is the logged in user
	if (userID === loggedInUserID) {
		const photoSubmissions = await getPhotoSubmissions();
		return {
			user,
			photoSubmissions,
			friendStatus: 'self'
		};
	}

	const loggedInUserFriendData = await getAllFriendData(loggedInUserID);

	// check if the logged-in user has an outgoing friend request to the user
	for (const outgoingFR of loggedInUserFriendData.outgoingFriendRequests) {
		if (outgoingFR.userID === userID) {
			return { user, friendStatus: 'outgoingRequest' };
		}
	}
	// check if the logged-in user has an incoming friend request to the user
	for (const incomingFR of loggedInUserFriendData.incomingFriendRequests) {
		if (incomingFR.userID === userID) {
			const photoSubmissions = await getPhotoSubmissions();
			return {
				user,
				photoSubmissions,
				friendStatus: 'incomingRequest'
			};
		}
	}

	for (const user of loggedInUserFriendData.friends) {
		if (user.userID === userID) {
			const photoSubmissions = await getPhotoSubmissions();
			return {
				user,
				photoSubmissions,
				friendStatus: 'friends'
			};
		}
	}

	return { user, friendStatus: 'none' };
}
