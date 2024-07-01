const express = require( 'express' );
const supabase = require( '../../../app/Utils/Supabase/Supabase' );

const router = express.Router();

router.get( '/', async ( req, res ) =>
{
    try
    {
        const token = req.headers.authorization?.split( 'Bearer ' )[ 1 ];

        if ( !token )
        {
            throw new Error( 'Unauthorized' );
        }

        const { data: user, error: authError } = await supabase.auth.getUser( token );

        if ( authError )
        {
            throw new Error( authError.message );
        }

        if ( !user )
        {
            throw new Error( 'User not found.' );
        }

        const { author_id, page = 1, limit = 10 } = req.query || {};
        const offset = (page - 1) * limit;

        let query = supabase
            .from('books')
            .select('book_id, title, author_id, price, publish_date')
            .order('publish_date', { ascending: true })
            .range(offset, offset + limit - 1);

        if (author_id) {
            query = query.eq('author_id', author_id);
        }

        const { data, error } = await query;

        if ( error )
        {
            throw new Error( error.message );
        }

        res.send( {
            status: 1,
            data: data,
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
