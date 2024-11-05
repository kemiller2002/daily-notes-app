import { Octokit } from "octokit";

export default function Communicator(localStorage) {
  const repoAccess = {
    token: localStorage.getItem("token"),
    repo: localStorage.getItem("repo"),
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
    owner: localStorage.getItem("owner"),
  };

  function updateLoginInformation(information) {
    try {
      repoAccess = information;

      return true;
    } catch {}
    return false;
  }

  const octokit = (token) =>
    new Octokit({
      auth: token,
    });

  const getData = function (path) {
    const octo = octokit(repoAccess.token);
    return octo.request(`GET /repos/{owner}/{repo}/${path}`, {
      owner: repoAccess.owner,
      repo: repoAccess.repo,
      per_page: 2,
      timestamp: new Date().getTime(),
    });
  };

  this.sendData = function ({ path, content, sha }) {
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
      content: btoa(JSON.stringify(content, null, 2)),
      committer: { ...user },
      author: { ...user },
      sha,
    });
  };

  this.getFileOrDefault = function (path) {
    return getData(path);
  };
}
