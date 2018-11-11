import express from "express";
import graphqlHTTP from "express-graphql";
import Knex from "knex";
import _debug from "debug";
import rimraf from "rimraf";
import {v4 as uuid} from "uuid";
import { mapDataSource, useDatabaseConnector, types, operationPresets, mapSchema } from "../../src"
import { printSchema, GraphQLList, GraphQLString, GraphQLID, typeFromAST } from "graphql";

rimraf.sync("./db.sqlite");

let knex: Knex;
const {DB_TYPE} = process.env;

const debug = _debug("hogwarts");

if (DB_TYPE === "SQLITE") {
    // Sample invocation with sqlite:
    // DB_TYPE=SQLITE yarn run start
    knex = Knex({
        client: 'sqlite3',
        connection: {
            filename: "./db.sqlite"
        },
        debug: true
    });
} else if (DB_TYPE === "PG") {
    // Sample invocation with postgres:
    // DB_TYPE=PG PG_CONNECTION_STRING=postgres://postgres:postgres@localhost/greldal_test yarn run start
    if (!process.env.PG_CONNECTION_STRING) {
        throw new Error('expected PG_CONNECTION_STRING env variable');
    }
    knex = Knex({
        client: 'pg',
        connection: process.env.PG_CONNECTION_STRING,
        searchPath: ['knex', 'public'],
        debug: true
    });
} else {
    throw new Error('Expected process.env.DB_TYPE to either be SQLITE or PG');
}

useDatabaseConnector(knex);

const setup = async () => {
    for (const tbl of [
        'teacher_enrollments',
        'student_enrollments',
        'issues',
        'classes',
        'students',
        'houses',
        'users'
    ]) {
        await knex.schema.dropTableIfExists(tbl);
    }
    await knex.schema.createTable('users', (t) => {
        t.increments();
        t.string('name');
        t.timestamps();
        t.boolean('alive');
    });
    await knex.schema.createTable('issues', (t) => {
        t.increments();
        t.integer('user_id');
        t.string('subject');
        t.text('details');
        t.timestamps();
    });
    await knex.schema.createTable('houses', (t) => {
        t.uuid('id').primary();
        t.string('name');
        t.jsonb('values');
        if (DB_TYPE === 'PG') {
            t.specificType('colors', 'varchar[2]');
        }
        t.integer('founder_id').notNullable();
        t.foreign('founder_id').references('id').inTable('users');
    });
    await knex.schema.createTable('students', (t) => {
        t.increments();
        t.integer('user_id').notNullable();
        t.uuid('house_id').notNullable();
        t.foreign('user_id').references('id').inTable('users');
        t.foreign('house_id').references('id').inTable('houses');
        t.integer('admission_year')
    });
    await knex.schema.createTable('classes', (t) => {
        t.increments();
        t.string('name');
    });
    await knex.schema.createTable('teacher_enrollments', (t) => {
        t.increments();
        t.integer('teacher_id').notNullable();
        t.integer('class_id').notNullable();
        t.foreign('teacher_id').references('id').inTable('users');
        t.foreign('class_id').references('id').inTable('classes');
        t.integer('batch_year');
    });
    await knex.schema.createTable('student_enrollments', (t) => {
        t.increments();
        t.integer('class_id').notNullable();
        t.integer('student_id').notNullable();
        t.foreign('class_id').references('id').inTable('classes');
        t.foreign('student_id').references('id').inTable('students');
        t.integer('batch_year');
    });
    await knex('users')
        .insert([
            { id: 1, name: 'Harry Potter' },
            { id: 2, name: 'Cho Chang' },
            { id: 3, name: 'Godric Gryffindor' },
            { id: 4, name: 'Helga Hufflepuff' },
            { id: 5, name: 'Rowena Ravenclaw' },
            { id: 6, name: 'Salazar Slytherin' },
            { id: 7, name: 'Sir Nicholas de Mimsy-Porpington'},
            { id: 8, name: 'Minerva McGonagall'},
            { id: 9, name: 'Severus Snape'},
            { id: 10, name: 'Quirinus Quirrell'},
            { id: 11, name: 'Sybill Trelawney'}
        ]);
    await knex('issues')
        .insert([
            { id: 1, user_id: 1, subject: 'Quidditch broom has missing hairs', details: 'Lorem ipsum dolor sit amet' },
            { id: 2, user_id: 1, subject: 'Moaning Myrtle has become more transparent', details: 'Lorem ipsum dolor sit amet' }
        ])
    const houses = [
        {id: uuid(), name: 'Gryffindor', founder_id: 3, values: JSON.stringify(['courage', 'bravery', 'nerve', 'chivalry']), colors: '{"scarlet", "gold"}'},
        {id: uuid(), name: 'Hufflepuff', founder_id: 4, values: JSON.stringify(['hard work', 'patience', 'justice', 'loyalty']), colors: '{"canary yellow", "black"}'},
        {id: uuid(), name: 'Ravenclaw', founder_id: 5, values: JSON.stringify(['intelligence', 'creativity', 'learning', 'wit']), colors: '{"blue", "bronze"}'},
        {id: uuid(), name: 'Slytherin', founder_id: 6, values: JSON.stringify(['ambition', 'cunning', 'leadership', 'resourcefulness']), colors: '{"green", "silver"}'}
    ];
    if (DB_TYPE !== 'PG') {
        houses.forEach(h => {
            delete h.colors;
        });
    }
    await knex('houses').insert(houses)
    const gryffindor = await knex('houses').where('name', 'Gryffindor').first();
    const ravenclaw = await knex('houses').where('name', 'Ravenclaw').first()
    await knex('students').insert([
        {user_id: 1, house_id: gryffindor.id, admission_year: 1991},
        {user_id: 2, house_id: ravenclaw.id, admission_year: 1990}
    ]);
    await knex('classes').insert([
        {id: 1, name: 'Defense against Dark Arts'},
        {id: 2, name: 'Charms'},
        {id: 3, name: 'Herbology'},
        {id: 4, name: 'Transfiguration'},
        {id: 5, name: 'Care of Magical Creatures'},
        {id: 6, name: 'Arithmancy'},
        {id: 7, name: 'Astronomy'},
        {id: 8, name: 'Potions'},
        {id: 9, name: 'Divination'}
    ]);
    await knex('teacher_enrollments').insert([
        {teacher_id: 8, class_id: 4, batch_year: 1991},
        {teacher_id: 9, class_id: 1, batch_year: 1996},
        {teacher_id: 10, class_id: 1, batch_year: 1991},
        {teacher_id: 11, class_id: 9, batch_year: 1991}
    ]);
    await knex('student_enrollments').insert([
        {student_id: 1, class_id: 4, batch_year: 1991},
        {student_id: 1, class_id: 1, batch_year: 1996},
        {student_id: 1, class_id: 1, batch_year: 1991},
        {student_id: 1, class_id: 9, batch_year: 1991}
    ]);
};


(async () => {
    await setup();

    const userDataSource = mapDataSource({
        name: 'User',
        description: 'Users',
        fields: {
            id: {
                type: types.string,
                to: {
                    input: GraphQLID,
                    output: GraphQLID
                }
            },
            name: {
                type: types.string,
            }
        },
        // queries: operationPresets.query.all(),
        // mutations: operationPresets.mutation.all(),
        // associations: [{
        //     name: 'complaints',
        //     target: 'Complaint',
        //     isSingular: false,
        //     joinType: 'leftJoin',
        //     associatorColumns: {
        //         inSource: 'id',
        //         inRelated: 'user_id'
        //     }
        // }]
    });

    console.log('=> ', userDataSource.recordType);

    const userQueries = operationPresets.query.all(userDataSource);

    // dataSource({
    //     name: {
    //         mapped: 'Complaint',
    //         stored: 'issues'
    //     },
    //     mapColumns: true,
    //     queries: operationPresets.query.all(),
    //     mutations: operationPresets.mutation.all(),
    // });

    // dataSource({
    //     name: 'House',
    //     mapColumns: (col) => {
    //         if (col.type === 'jsonb' || col.type === 'ARRAY') {
    //             return false;
    //         }
    //         return true;
    //     },
    //     mapForeignKeys: true,
    //     queries: operationPresets.query.all(),
    //     mutations: operationPresets.mutation.all(),
    // });

    // dataSource({
    //     name: 'Student',
    //     mapColumns: true,
    //     mapForeignKeys: true
    // });

    // dataSource({
    //     name: 'Class',
    //     mapColumns: true,
    //     queries: operationPresets.query.all(),
    //     mutations: operationPresets.mutation.all(),
    //     associations: [{
    //         name: 'studentEnrollments',
    //         target: "StudentEnrollment",
    //         isSingular: false,
    //         associatorColumns: {
    //             inSource: 'id',
    //             inRelated: 'class_id'
    //         },
    //         useIf: ({resolveInfoVisitor}) => {
    //             debug("parsedResolveInfo:", resolveInfoVisitor.parsedResolveInfo);
    //             const where:any = resolveInfoVisitor.parsedResolveInfo.args.where;
    //             return !!where.id;
    //         },
    //         preFetch: ({source, context, args, resolveInfoVisitor}) => ({
    //             queryName: 'findManyStudentEnrollments',
    //             resolverParams: {
    //                 source,
    //                 context,
    //                 resolveInfo: resolveInfoVisitor.originalResolveInfoRoot,
    //                 args: {
    //                     where: {
    //                         class_id: (resolveInfoVisitor.parsedResolveInfo.args.where as any).id
    //                     }
    //                 }
    //             }
    //         })
    //     }, {
    //         name: 'studentEnrollments',
    //         target: "StudentEnrollment",
    //         isSingular: false,
    //         associatorColumns: {
    //             inSource: 'id',
    //             inRelated: 'class_id'
    //         },
    //         postFetch: ({source, context, args, resolveInfoVisitor}, classes) => ({
    //             queryName: 'findManyStudentEnrollmentsByClassIds',
    //             resolverParams: {
    //                 source,
    //                 context,
    //                 resolveInfo: resolveInfoVisitor.originalResolveInfoRoot,
    //                 args: {
    //                     class_ids: classes.map(c => c.id)
    //                 }
    //             }
    //         })
    //     }]
    // });

    // dataSource({
    //     name: 'StudentEnrollment',
    //     mapColumns: true,
    //     queries: [
    //         ...operationPresets.query.all(),
    //         (d) => ({
    //             name: 'findManyStudentEnrollmentsByClassIds',
    //             args: [{
    //                 name: 'class_ids',
    //                 type: GraphQLList(GraphQLString)
    //             }],
    //             singular: false,
    //             run: (operation) => {
    //                 debug('Deferring operation: ', operation);
    //                 return defaultResolvers.resolveQuery({
    //                     ...operation,
    //                     buildQuery: (qb: Knex.QueryBuilder) => qb.whereIn('class_id', operation.args.class_ids)
    //                 } as any);
    //             }
    //         })
    //     ],
    //     mutations: operationPresets.mutation.all(),
    // });

    // dataSource({
    //     name: 'TeacherEnrollment',
    //     mapColumns: true,
    //     queries: operationPresets.query.all(),
    //     mutations: operationPresets.mutation.all(),
    // });

    const generatedSchema = mapSchema(userQueries);

    console.log('Generated Schema:', printSchema(generatedSchema));

    const app = express();

    app.use(
        "/",
        graphqlHTTP({
            schema: generatedSchema,
            graphiql: true,
            formatError: (error) => {
                console.error(error);
                return {
                    name: error.name,
                    message: error.message,
                    stack: error.stack && error.stack.split('\n')
                }
            }
        })
    );

    app.listen(4000);
})();
