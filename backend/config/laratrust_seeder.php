<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laratrust Seeder Configuration
    |--------------------------------------------------------------------------
    */

    // Création automatique des utilisateurs de test lors du seeding
    'create_users' => true,

    // Vide les tables avant d'insérer les nouveaux rôles et permissions
    'truncate_tables' => true,

    /*
    |--------------------------------------------------------------------------
    | Structure des rôles et permissions selon Smart Psy
    |--------------------------------------------------------------------------
    */
    'roles_structure' => [

        // 👤 Patient
        'patient' => [
            'rendezvous' => 'c,r,u,d',   // Prendre, consulter, modifier, annuler ses rendez-vous
            'profile' => 'r,u',          // Voir et modifier son profil
        ],

        // 🧑‍⚕️ Médecin
        'medecin' => [
            'rendezvous' => 'r,u',       // Voir et confirmer/annuler les rendez-vous reçus
            'patients' => 'r',           // Voir les patients qui ont pris rendez-vous
            'profile' => 'r,u',          // Voir et modifier son profil
        ],

        // 🛠️ Administrateur
        'admin' => [
            'users' => 'c,r,u,d', 
            'medecins' => 'c,r,u,d',       // Gérer tous les utilisateurs
            'rendezvous' => 'r,u,d',     // Superviser et gérer les rendez-vous
            'dashboard' => 'r',          // Accès au tableau de bord global
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Mapping des permissions
    |--------------------------------------------------------------------------
    */
    'permissions_map' => [
        'c' => 'create',
        'r' => 'read',
        'u' => 'update',
        'd' => 'delete',
    ],
];
