CREATE TABLE IF NOT EXISTS mockinterview (
    id SERIAL PRIMARY KEY NOT NULL,
    jsonmockresp TEXT NOT NULL,
    jobposition VARCHAR(1000) NOT NULL,
    jobdescription VARCHAR(1000) NOT NULL,
    jobexp VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50),
    createdby VARCHAR(255) NOT NULL,
    createdat TIMESTAMP DEFAULT NOW(),
    mockid VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "userAnswers" (
    id SERIAL PRIMARY KEY NOT NULL,
    mockid VARCHAR NOT NULL,
    question VARCHAR NOT NULL,
    correctanswer VARCHAR,
    useranswer TEXT,
    feedback TEXT,
    rating VARCHAR,
    "userEmail" VARCHAR,
    createdat VARCHAR
);
