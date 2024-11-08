import { Octokit, App } from "octokit";

export default function Communicator(localStorage) {
  const repoAccess = {
    token: localStorage.getItem("token").value,
    repo: localStorage.getItem("repo").value,
    name: localStorage.getItem("name").value,
    email: localStorage.getItem("email").value,
    owner: localStorage.getItem("owner").value,
  };

  function updateLoginInformation(information) {
    try {
      repoAccess = information;

      return true;
    } catch {}
    return false;
  }

  const octokit = (token) => new Octokit({ auth: token });

  const getFile = (path) => {
    const octo = octokit(repoAccess.token);

    return octo.rest.repos
      .getContent({
        owner: repoAccess.owner,
        repo: repoAccess.repo,
        path,
      })
      .then((result) => {
        const content = atob(result.data.content);

        return { ...result.data, decodedContent: content };
      });
  };

  const getData = function (path) {
    const octo = octokit(repoAccess.token);

    return octo.request(`GET /repos/{owner}/{repo}/${path}`, {
      owner: repoAccess.owner,
      repo: repoAccess.repo,
      per_page: 2,
      timestamp: new Date().getTime(),
    });
  };

  this.testLogin = async function () {
    const octo = octokit(repoAccess.token);

    const {
      data: { login },
    } = await octo.rest.users.getAuthenticated();

    return login;
  };

  this.sendData = function ({ path, updatedContent, sha }) {
    const user = {
      name: repoAccess.name,
      email: repoAccess.email,
    };

    console.log("HERE");

    const octo = octokit(repoAccess.token);

    return octo.rest.repos
      .createOrUpdateFileContents({
        owner: repoAccess.owner,
        repo: repoAccess.repo,
        path,
        message: `Updating of ${path}`,
        content: btoa(updatedContent),
        committer: { ...user },
        author: { ...user },
        sha,
      })
      .then((x) => console.log(x));
  };

  this.getFileOrDefault = function (path) {
    return getFile(path);
  };
}
