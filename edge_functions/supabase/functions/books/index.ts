import { createClient } from '@supabase/supabase-js'

const supabase_url = Deno.env.get('SUPABASE_URL')!;
const supabase_api_key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient( supabase_url, supabase_api_key );

Deno.serve( async (req) => {
  try
  {
    const token = req.headers.get( 'authorization' )?.split( 'Bearer ' )[ 1 ];

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

    const url = new URL( req.url );
    const author_id = url.searchParams.get( 'author_id' );
    const page = parseInt( url.searchParams.get( 'page' ) || '1' );
    const limit = parseInt( url.searchParams.get( 'limit') || '10' );
    const offset = ( page - 1 ) * limit;

    let query = supabase
        .from('books')
        .select('book_id, title, author_id, price, publish_date')
        .order('publish_date', { ascending: true })
        .range(offset, offset + limit - 1);

    if ( author_id )
    {
      query = query.eq( 'author_id', author_id );
    }

    const { data, error } = await query;

    if ( error )
    {
      throw new Error( error.message );
    }

    return new Response( JSON.stringify( {
      status: 1,
      data: data,
    } ), { status: 200 } );
  } catch ( error )
  {
    return new Response( JSON.stringify( {
      status: 0,
      data: error.message
    } ), { status: 400 } );
  }
} );
