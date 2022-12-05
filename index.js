// Fill in your client ID and client secret that you obtained
// while registering the application
const clientID = '"955bdd04-63f8-47dd-ab16-7907a4494ce6"'
const clientSecret = 'a65beed5a5466e5336d3258aee30891d3630723166738600bcac21326e2939bc'

const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');
const axios = require('axios');

const app = new Koa();

const main = serve(path.join(__dirname + '/public'));

const oauth = async ctx => {
  const requestToken = ctx.request.query.code;
  console.log('authorization code:', requestToken);

  const tokenResponse = await axios({
    method: 'post',
    url: 'https://api.mixin.one/oauth/token',
    data: {
      "client_id": clientID,
      "client_secret": clientSecret,
      "code": requestToken,
    },
    headers: {
      accept: 'application/json'
    }
  }).catch(err => {
    console.log("请求错误", err)
  });

  const accessToken = tokenResponse.data.data.access_token;
  console.log(`access token: ${accessToken}`);

  const result = await axios({
    method: 'get',
    url: `https://api.mixin.one/me`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
  console.log(result.data);
  const name = result.data.data.full_name;
  const avatar_url = result.data.avatar_url;

  ctx.response.redirect(`/welcome.html?name=${name}`);
};

app.use(main);
app.use(route.get('/oauth/redirect', oauth));

app.listen(8080);
