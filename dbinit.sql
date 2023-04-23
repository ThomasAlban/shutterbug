ALTER TABLE "reports" DROP CONSTRAINT "reports_culprit_id_foreign";
ALTER TABLE "photos" DROP CONSTRAINT "photos_theme_id_foreign";
ALTER TABLE "votes" DROP CONSTRAINT "votes_photo_id_foreign";
ALTER TABLE "friends" DROP CONSTRAINT "friends_requestee_id_foreign";
ALTER TABLE "votes" DROP CONSTRAINT "votes_voter_id_foreign";
ALTER TABLE "reports" DROP CONSTRAINT "reports_reporter_id_foreign";
ALTER TABLE "friends" DROP CONSTRAINT "friends_requester_id_foreign";

DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
    "user_id" UUID NOT NULL PRIMARY KEY,
    "username" VARCHAR(20) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "date_created" TIMESTAMP WITH TIME ZONE NOT NULL,
    "profile_photo" VARCHAR(100),
    "admin" BOOLEAN NOT NULL DEFAULT '0'
);

DROP TABLE IF EXISTS "friends";
CREATE TABLE "friends" (
    "requester_id" UUID NOT NULL,
    "requestee_id" UUID NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT '0',
    PRIMARY KEY("requester_id", "requestee_id")
);

DROP TABLE IF EXISTS "photos";
CREATE TABLE "photos" (
    "photo_id" UUID NOT NULL PRIMARY KEY,
    "user_id" UUID NOT NULL,
    "theme_id" UUID NOT NULL,
    "photo" VARCHAR(100) NOT NULL,
    "date_added" TIMESTAMP WITH TIME ZONE NOT NULL
);

DROP TABLE IF EXISTS "votes";
CREATE TABLE "votes" (
    "voter_id" UUID NOT NULL,
    "photo_id" UUID NOT NULL,
    "vote_humour" SMALLINT NOT NULL CHECK (
        "vote_humour" BETWEEN 0 AND 10
    ),
    "vote_creativity" SMALLINT NOT NULL CHECK (
        "vote_creativity" BETWEEN 0 AND 10
    ),
    "vote_photography" SMALLINT NOT NULL CHECK (
        "vote_photography" BETWEEN 0 AND 10
    ),
    PRIMARY KEY("voter_id", "photo_id")
);

DROP TABLE IF EXISTS "themes";
CREATE TABLE "themes" (
    "theme_id" UUID NOT NULL PRIMARY KEY,
    "theme" VARCHAR(50) NOT NULL,
    "start_date" TIMESTAMP WITH TIME ZONE NOT NULL,
    "end_date" TIMESTAMP WITH TIME ZONE NOT NULL
);

DROP TABLE IF EXISTS "reports";
CREATE TABLE "reports" (
    "reporter_id" UUID NOT NULL,
    "culprit_id" UUID NOT NULL,
    "reason" VARCHAR(255),
    PRIMARY KEY("reporter_id", "culprit_id")
);

ALTER TABLE "reports" 
    ADD CONSTRAINT "reports_culprit_id_foreign" FOREIGN KEY("culprit_id") REFERENCES "users"("user_id");
ALTER TABLE "photos" 
    ADD CONSTRAINT "photos_theme_id_foreign" FOREIGN KEY("theme_id") REFERENCES "themes"("theme_id");
ALTER TABLE "votes" 
    ADD CONSTRAINT "votes_photo_id_foreign" FOREIGN KEY("photo_id") REFERENCES "photos"("photo_id");
ALTER TABLE "friends" 
    ADD CONSTRAINT "friends_requestee_id_foreign" FOREIGN KEY("requestee_id") REFERENCES "users"("user_id");
ALTER TABLE "votes" 
    ADD CONSTRAINT "votes_voter_id_foreign" FOREIGN KEY("voter_id") REFERENCES "users"("user_id");
ALTER TABLE "reports" 
    ADD CONSTRAINT "reports_reporter_id_foreign" FOREIGN KEY("reporter_id") REFERENCES "users"("user_id");
ALTER TABLE "friends" 
    ADD CONSTRAINT "friends_requester_id_foreign" FOREIGN KEY("requester_id") REFERENCES "users"("user_id");