const dotenv = require('dotenv');
const express = require( 'express' );
const supabase = require( '../../../app/Utils/Supabase/Supabase' );

const router = express.Router();

dotenv.config();

router.post('/signup', async ( req, res ) =>
{
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: process.env.SUPABASE_URL,
            },
        })

        if ( error )
        {
            res.status( 400 ).send( {
                status: 0,
                data: error.message
            } );
        }

        res.send( {
            status: 1,
            data: data
        } );
    }
    catch ( error )
    {
        res.status( 400 ).send( {
            status: 0,
            data: error.message
        } );
    }
} );

router.post('/login', async ( req, res ) =>
{
    try
    {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword( {
            email,
            password,
        } );

        if ( error )
        {
            res.status( 400 ).send( {
                status: 0,
                data: error.message
            } );
        }

        res.send( {
            status: 1,
            data: data
        } );
    }
    catch ( error )
    {
        res.status( 400 ).send( {
            status: 0,
            data: error.message
        } );
    }
} );

module.exports = router;
