CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	lastname VARCHAR(100),
	firstname VARCHAR(100),
	email VARCHAR(150) UNIQUE,
	created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE activities (
	id SERIAL PRIMARY KEY,
	title VARCHAR(255), 
	description TEXT,
	location VARCHAR(255),
	date_activity DATE,
	created_at TIMESTAMP DEFAULT NOW(),
	creator_id INTEGER REFERENCES users(id),
    max_participants INTEGER
);

CREATE TABLE registrations_activities (
	id SERIAL PRIMARY KEY,
	activity_id INTEGER REFERENCES activities(id),
	user_id INTEGER REFERENCES users(id), 
	created_at TIMESTAMP DEFAULT NOW(),
	UNIQUE (activity_id, user_id)
);

/* A potentiellement rajouter : 
- Dernière date de modification;
- Statut de l'activité (active, annulée, terminée); (si jamais on a un historique d'activités, c'est bien);
- Ajouter une image pour l'activité;
*/

