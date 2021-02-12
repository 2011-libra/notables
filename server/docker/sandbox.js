const Docker = require('dockerode');
const docker = new Docker();
const streams = require('memory-streams');
const path = require('path');
const tar = require('tar');

const removeStaleContainer = async token => {
  try {
    const staleContainer = docker.getContainer(`${token}-container`);
    await staleContainer.remove();
  } catch (error) {
    console.log('Error in removeStaleContainer:', error);
  }
};

const makeContainer = async token => {
  try {
    const container = await docker.createContainer({
      Image: 'node-libra',
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      Cmd: ['node', 'runner'],
      name: `${token}-container`,
      HostConfig: {
        CapDrop: ['ALL']
      }
    });
    return container;
  } catch (error) {
    if (error.statusCode === 409) {
      // Error: container already exists
      await removeStaleContainer(token);
      return makeContainer(token);
    } else {
      console.log('Error in createContainer:', error);
    }
  }
};

const archiveCode = async token => {
  try {
    await tar.create(
      {
        cwd: path.join(__dirname, `/tmp/${token}`),
        file: path.join(__dirname, `/tmp/${token}/code.tar`)
      },
      ['code.json']
    );
  } catch (error) {
    console.log('Error in archiveCode:', error);
  }
};

const putCodeInContainer = async (container, token) => {
  try {
    await container.putArchive(path.join(__dirname, `/tmp/${token}/code.tar`), {
      path: '/'
    });
  } catch (error) {
    console.log('Error in putCodeInContainer:', error);
  }
};

const listenToContainer = async (container, stream) => {
  try {
    const attachedStream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true
    });
    attachedStream.pipe(stream);
  } catch (error) {
    console.log('Error in listenToContainer:', error);
  }
};

const runContainer = async token => {
  const stdout = new streams.WritableStream();
  const container = await makeContainer(token);

  try {
    await archiveCode(token);
    await putCodeInContainer(container, token);
    await listenToContainer(container, stdout);
    await container.start();
  } catch (error) {
    console.log('Error in runContainer:', error);
  } finally {
    // Next line will automatically kill container in 10 sec.
    await container.stop();
    await container.remove();
  }

  return stdout.toString();
};

const trimControlCharacters = string => {
  let readableOutput = '';
  for (let i = 0; i < string.length; i++) {
    if (string.charCodeAt(i) > 31 || string.charCodeAt(i) === 10) {
      readableOutput += string[i];
    }
  }
  return readableOutput;
};

const run = async token => {
  try {
    const rawOutput = await runContainer(token);
    return trimControlCharacters(rawOutput);
  } catch (error) {
    console.log('Error in run:', error);
    return '[server error in running code]';
  }
};

module.exports = run;
