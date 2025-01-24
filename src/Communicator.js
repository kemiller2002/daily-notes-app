import { Octokit, App } from "octokit";
import { reducer } from "./Reducer";

export default function Communicator(localStorage) {
  const localDatastore = localStorage.getItem(
    localStorage.dataStoreLoginKey
  ).value;

  const repoAccess = {
    token: localDatastore.token,
    repo: localDatastore.repo,
    name: localDatastore.name,
    email: localDatastore.email,
    owner: localDatastore.owner,
  };

  console.log(repoAccess);

  function updateLoginInformation(information) {
    try {
      repoAccess = information;

      return true;
    } catch {}
    return false;
  }

  const octokit = (token) => new Octokit({ auth: token });

  const cachedFiles = {};

  const defaultExpirationInSeconds = 300;

  function getCachedFile(path) {
    return [
      (p) => cachedFiles[p],
      (f) => (f && f.expiration > new Date() ? f.data : undefined),
    ].reduce(reducer, path);
  }

  function clearCacheItem(path) {
    cachedFiles[path] = undefined;
  }

  function getFile(path) {
    const octo = octokit(repoAccess.token);

    return (
      getCachedFile(path) ||
      octo.rest.repos
        .getContent({
          owner: repoAccess.owner,
          repo: repoAccess.repo,
          path,
        })
        .then((result) => {
          const expiration = new Date();
          expiration.setSeconds(
            expiration.getSeconds() + defaultExpirationInSeconds
          );

          const content = atob(result.data.content);
          const data = { ...result.data, decodedContent: content };

          cachedFiles[path] = { data, expiration };

          return data;
        })
        .catch((x) => {
          console.log(x);
        })
    );
  }

  const getData = function (path) {
    const octo = octokit(repoAccess.token);

    return octo.request(`GET /repos/{owner}/{repo}/${path}`, {
      owner: repoAccess.owner,
      repo: repoAccess.repo,
      per_page: 2,
      timestamp: new Date().getTime(),
    });
  };

  this.sendData = function ({ path, updatedContent, sha }) {
    clearCacheItem(path);
    const user = {
      name: repoAccess.name,
      email: repoAccess.email,
    };

    const octo = octokit(repoAccess.token);

    return octo.rest.repos.createOrUpdateFileContents({
      owner: repoAccess.owner,
      repo: repoAccess.repo,
      path,
      message: `Updating of ${path}`,
      content: btoa(updatedContent),
      committer: { ...user },
      author: { ...user },
      sha,
    });
  };

  this.getFileOrDefault = async function (path) {
    return (await getFile(path)) || {};
  };

  this.testLogin = async function () {
    const octo = octokit(repoAccess.token);

    const {
      data: { login },
    } = await octo.rest.users.getAuthenticated();

    return login;
  };
}
