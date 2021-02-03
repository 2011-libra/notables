const Docker = require('dockerode');
const docker = new Docker();
const streams = require('memory-streams');
const path = require('path');
const tar = require('tar');

const runContainer = async token => {
  const stdout = new streams.WritableStream();
  const container = await docker.createContainer({
    Image: 'node:12-alpine',
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    cmd: ['node', 'code'],
    name: `${token}-container`
  });

  await tar.create(
    {
      cwd: path.join(__dirname, `/${token}`),
      file: path.join(__dirname, `/${token}/code.tar`)
    },
    ['code.js'],
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Tar file of source code created');
      }
    }
  );

  await container.putArchive(
    path.join(__dirname, `/${token}/code.tar`),
    { path: '/' },
    (writeError, writeStream) => {
      if (writeError) {
        console.error('put archive error', writeError);
      }
      console.log('put archive finished');
    }
  );

  const stream = await container.attach({
    stream: true,
    stdout: true,
    stderr: true
  });
  console.log('all good?*****');
  stream.pipe(stdout);
  console.log('all good!*****');

  await container.start();
  await container.stop();
  await container.remove();
  console.log('End of sandbox file.');

  return stdout.toString();
};

const run = async token => {
  try {
    const output = await runContainer(token);
    console.log('DONE!');

    let readableOutput = '';
    for (let i = 0; i < output.length; i++) {
      if (output.charCodeAt(i) > 31) {
        readableOutput += output[i];
      }
    }
    return readableOutput;
  } catch (error) {
    console.log(error);
  }
};

module.exports = run;

// In this version, a new image is compiled every time.
// const makeImage = token => {
//   docker.buildImage(
//     {
//       context: path.join(__dirname, `/${token}`),
//       src: ['Dockerfile', `code.js`]
//     },
//     { t: `${token}-image` },
//     (err, response) => {
//       err ? console.log(err) : console.log('Image Built.');
//     }
//   );
// };
// const run = async token => {
//   try {
//     makeImage(token)
//     await runContainer(token);
//     const image = docker.getImage(`${token}-image`)
//     await image.remove()
//     console.log('DONE!');
//     console.log('stdout: ', stdout.toString());
//     return stdout.toString();
//   } catch (error) {
//     console.log(error);
//   }
// };

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
