
var http   = require('http')
  , url    = require('url')
  , dns    = require('dns')
  , npid   = require('npid')
  , bunyan = require('bunyan');

try { npid.create(__dirname + '/dns.chakrit.net.pid', true); }
catch (e) { console.error(e); process.exit(1); }

var logger = bunyan.createLogger({ name: "dns.chakrit.net" });

var server = http.createServer(function(req, resp) {
  var log    = logger.child({ req: req })
    , domain = url.parse(req.url).pathname.substr(1);

  log.info("resolve: %s", domain);
  dns.resolve(domain, function(e, records) {
    if (e) {
      log.error(e);
      resp.writeHead(500, e.message);
      return resp.end();
    }

    log.info("resolved: %s %j", domain, records);
    resp.writeHead(200, { 'Content-Type': 'application/json' });
    return resp.end(JSON.stringify(records));
  });
});

server.listen(process.env.PORT || 8080);

