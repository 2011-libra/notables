// Mounted on 'api/code'
const Docker = require('dockerode');
const docker = new Docker();
const streams = require('memory-streams')
const stdout = new streams.WritableStream();
const stderr = new streams.WritableStream();
const path = require('path')

const makeImage = async () => {
await docker.buildImage({
    context: path.join(__dirname, '/sample'),
    src: ['Dockerfile', 'code.js']
  }, {t: 'sample'}, (err, response) => {
    // console.log('ERROR :', err, 'REPSONSE :', response)
  }
)

  await docker.createContainer({
    Image: 'sample',
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    cmd: [],
    name: 'sample-container'},
    function (err, container){
  })

let output = '';
const [res, container] = await docker.run(
  'sample',
  ['node', 'code'],
  [stdout, stderr],
  { Tty: false }
)
    await console.log('[sandbox.js] stdout: %j', stdout.toString())
    output = await stdout.toString();
    // console.log('stderr: %j', stderr.toString())
    await container.remove()

return output;

}

module.exports = makeImage;

// const container = docker.getContainer('sample15')
// container.attach({stream: true, stdout: true, stderr: true}, function (err, stream) {
//   console.log('*****************')
//   // stream.pipe(process.stdout)
//   // console.log('STREAM', output.toString())
//   // container.modem.demuxStream(stream, process.stdout, process.stderr);
// })

// container.start(function (err, data) {
//   console.log(data);
// });

// console.log('create', create)
// stdout.write('hello world')

// docker.run('sample', ['/bin/sh', 'type', 'echo'], [stdout, stderr], function(err, data, container){
  // console.log('err', err, 'data', data, 'container', container, '**stdout', stdout.toString(), '**stderr', stderr)
// })

// const container = docker.getContainer('dc4d1892394e')
// container.start(function(err, data){console.log(data)})

// await new Promise((resolve, reject) => {
//   docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));})

