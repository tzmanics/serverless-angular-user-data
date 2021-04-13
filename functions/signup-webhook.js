const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { user } = JSON.parse(event.body);

  const responseBodyString = JSON.stringify({
    query: `
      mutation insertUser($id: String, $email:String, $name:String, $avatar:String, $created:timestamptz, $updated:timestamptz){
        insert_users(objects: {id: $id, email: $email, name: $name, avatar: $avatar, created: $created, updated: $updated}) {
          affected_rows
        }
      }
    `,
    variables: {
      id: user.id,
      email: user.email,
      name: user.user_metadata.full_name,
      avatar: user.user_metadata.avatar_url,
      created: user.created_at,
      updated: user.updated_at,
    },
  });

  const result = await fetch('https://accepted-loon-76.hasura.app/v1/graphql', {
    method: 'POST',
    body: responseBodyString,
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": process.env.HASURA_SECRET,
    },
  });

  const { errors, data } = await result.json();

  if (errors) {
    console.log(errors);
    return {
      statusCode: 500,
      body: 'summin aint right',
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify(responseBodyString),
    };
  }
};
