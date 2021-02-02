// Mounted on 'api/code'
const Docker = require('dockerode');
const docker = new Docker();
const streams = require('memory-streams');
const stdout = new streams.WritableStream();
// const stderr = new streams.WritableStream();
// const stdout2 = new streams.WritableStream();
// const stderr2 = new streams.WritableStream();
const path = require('path');
const targz = require ('targz');

const makeImage = (token) => {
  docker.buildImage(
    {
      context: path.join(__dirname, `/${token}`),
      src: ['Dockerfile', `code.js`]
    },
    { t: `${token}-image` },
    (err, response) => {
      err ? console.log(err) : console.log('Image Built.');
    }
  );
};

const runContainer = async (token) => {
  const container = await docker.createContainer({
    // Image: `${token}-image`,
    Image: 'node:12-alpine',
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    cmd: ['ls', '-a'],
    name: `${token}-container`
  });

  const source = targz.compress({
    src: path.join(__dirname, `/${token}/code.js`),
    dest: path.join(__dirname, `/${token}/code.tar.gz`)
  })
  // .createReadStream(path.join(__dirname, `/${token}/code.js`))

  container.putArchive(path.join(__dirname, `/${token}/code.tar.gz`), { path: '/' }, (writeError, writeStream) => {
    if (writeError) {
        console.error('put archive error', writeError);
    }
    console.log('put archive finished');
});

  const stream = await container.attach({
    stream: true,
    stdout: true,
    stderr: true
  });
  stream.pipe(stdout);

  await container.start();
  await container.stop();
  await container.remove();
  console.log('End of sandbox file.');
};

const run = async (token) => {
  try {
    // makeImage(token)
    await runContainer(token)
    // const image = docker.getImage(`${token}-image`)
    // await image.remove()
    console.log('DONE!');
    console.log('stdout: ', stdout.toString());
    return stdout.toString();
  } catch (error) {
    console.log(error);
  }
};

module.exports = run;



// const run = () => {
//   try {
//     runContainer().then(() => {
//       console.log('DONE!');
//       console.log('stdout: ', stdout.toString());
//       return stdout.toString();
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// --------------------------------------------
// const makeImage = async () => {
//   await docker.buildImage(
//     {
//       context: path.join(__dirname, '/sample'),
//       src: ['Dockerfile', 'code.js']
//     },
//     { t: 'sample' },
//     (err, response) => {
//       err?
//       console.log(err):
//       console.log('Image Built.')
//     }
//   );

//   await docker.createContainer(
//     {
//       Image: 'sample',
//       AttachStdin: false,
//       AttachStdout: true,
//       AttachStderr: true,
//       Tty: true,
//       cmd: [],
//       name: 'sample-container'
//     },
//     function (err, container) {
//       err?
//       console.log(err):
//       console.log('Container Created.')
//     }
//   );

//   await docker.run(
//     'sample',
//     ['node', 'code'],
//     [stdout2, stderr2],
//     { Tty: false }
//   );

//   let [res, container] = await docker.run(
//     'sample',
//     ['node', 'code'],
//     [stdout, stderr],
//     { Tty: false }
//   );

//   await console.log('[sandbox.js] stdout: %j', stdout.toString());

//   let output = await stdout.toString();
//   // console.log('stderr: %j', stderr.toString())
//   await container.remove();
//   console.log('End of sandbox file.');
//   return output;
// };
