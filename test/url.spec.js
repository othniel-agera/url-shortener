const { nanoid } = require('nanoid');
const {
  app, expect, request, postRequest, getRequest, deleteRequest,
} = require('./common.spec');
const UserLib = require('../lib/user.lib');
const URLLib = require('../lib/url.lib');
const { hashPassword } = require('../utils/utility.util');

const {
  createUser, fetchUser, destroyUser,
} = new UserLib();
const { fetchURLs } = new URLLib();

describe('URL related tests', () => {
  let token;
  let userToDelete;
  let user;
  const userData = {
    username: `${Date.now()}_kufre`,
    firstname: `${Date.now()}_Kufre`,
    lastname: `${Date.now()}_Okon`,
    email: `${Date.now()}_book.example@example.com`,
    password: 'Test1234',
  };
    // eslint-disable-next-line func-names
  before(async function () {
    this.timeout(10000);
    const password = await hashPassword(userData.password);
    user = await createUser({ ...userData, password });
    const response = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password })
      .set('Accept', 'application/json');
    token = response.body.accessToken;
  });
  describe('Positive Tests', () => {
    it('should shorten a URL successfully', async () => {
      const nanoURL = nanoid(10);
      const originalURL = `http://www.google.com/search?q=${nanoURL}`;

      const response = await postRequest('/shorten', token)
        .send({ originalURL })
        .expect(201);

      const resp_data = response.body;
      expect(resp_data).to.be.an('object');
      expect(resp_data).to.have.property('success');
      expect(resp_data).to.have.property('data');
      expect(resp_data.success).to.be.an('boolean');
      expect(resp_data.accessToken).to.not.equal(true);
      expect(resp_data.data).to.be.an('object');
      expect(resp_data.data).to.have.property('id');
      expect(resp_data.data).to.have.property('createdAt');
      expect(resp_data.data).to.have.property('updatedAt');
    });
    it('should fetch all the shortened urls successfully', async () => {
      const response = await fetchURLs();

      expect(response).to.be.an('array');
    });
    it('should get all the shortened urls successfully', async () => {
      const response = await getRequest('/nanoURLs', token)
        .expect(200);

      const resp_data = response.body;
      expect(resp_data).to.be.an('object');
      expect(resp_data).to.have.property('success');
      expect(resp_data).to.have.property('totalCount');
      expect(resp_data).to.have.property('countOnPage');
      expect(resp_data).to.have.property('pagination');
      expect(resp_data).to.have.property('data');
      expect(resp_data.success).to.be.an('boolean');
      expect(resp_data.accessToken).to.not.equal(true);
      expect(resp_data.data).to.be.an('array');
    });
    it('should get all the books with filters successfully', async () => {
      const response = await getRequest(`/nanoURLs?user=${user.id}`, token)
        .expect(200);

      const resp_data = response.body;
      expect(resp_data).to.be.an('object');
      expect(resp_data).to.have.property('success');
      expect(resp_data).to.have.property('totalCount');
      expect(resp_data).to.have.property('countOnPage');
      expect(resp_data).to.have.property('pagination');
      expect(resp_data).to.have.property('data');
      expect(resp_data.success).to.be.an('boolean');
      expect(resp_data.accessToken).to.not.equal(true);
      expect(resp_data.data).to.be.an('array');
    });
    it('should visit a specific url successfully', async () => {
      const nanoURL = nanoid(10);
      const originalURL = `http://www.google.com/search?q=${nanoURL}`;

      const url = await postRequest('/shorten', token)
        .send({ originalURL });

      await getRequest(`/${url.body.data.urlId}`, token)
        .expect(302);
    });
    it('should delete a specific book successfully', async () => {
      const nanoURL = nanoid(10);
      const originalURL = `http://www.google.com/search?q=${nanoURL}`;

      const url = await postRequest('/shorten', token)
        .send({ originalURL });

      const response = await deleteRequest(`/${url.body.data.urlId}`, token)
        .expect(202);

      const resp_data = response.body;
      expect(resp_data).to.be.an('object');
      expect(resp_data).to.have.property('success');
      expect(resp_data.success).to.be.an('boolean');
    });
  });
  describe('Negative Tests', () => {
    it('should not shorten URL successfully, URL already shortened', async () => {
      const nanoURL = nanoid(10);
      const originalURL = `http://www.google.com/search?q=${nanoURL}`;

      await postRequest('/shorten', token)
        .send({ originalURL });

      const response = await postRequest('/shorten', token)
        .send({ originalURL }).expect(422);

      const resp_data = response.body;
      expect(resp_data).to.be.an('object');
      expect(resp_data).to.have.property('success');
      expect(resp_data).to.have.property('error');
      expect(resp_data.success).to.be.an('boolean');
      expect(resp_data.success).to.equal(false);
      expect(resp_data.error).to.be.an('string');
    });
    it('should not shorten URL successfully originalURL is missing', async () => {
      const response = await postRequest('/shorten', token)
        .send({})
        .expect(422);

      const resp_data = response.body;
      expect(resp_data).to.be.an('object');
      expect(resp_data).to.have.property('success');
      expect(resp_data).to.have.property('error');
      expect(resp_data.success).to.be.an('boolean');
      expect(resp_data.success).to.equal(false);
      expect(resp_data.error).to.be.an('string');
      expect(resp_data.error).to.equal('ValidationError: "originalURL" is required');
    });
    it('should not visit URL successfully, no such nanoURL ID', async () => {
      const response = await getRequest('/636cda0b011883107d392958', token)
        .expect(404);

      const resp_data = response.body;
      expect(resp_data).to.be.an('object');
      expect(resp_data).to.have.property('success');
      expect(resp_data).to.have.property('error');
      expect(resp_data.success).to.be.an('boolean');
      expect(resp_data.success).to.equal(false);
      expect(resp_data.error).to.be.an('string');
      expect(resp_data.error).to.contain('NanoUrl: 636cda0b011883107d392958 is not correct');
    });
    it('should not delete book successfully, no such book ID', async () => {
      const response = await deleteRequest('/636cda0b011883107d392958', token)
        .expect(404);

      const resp_data = response.body;
      expect(resp_data).to.be.an('object');
      expect(resp_data).to.have.property('success');
      expect(resp_data).to.have.property('error');
      expect(resp_data.success).to.be.an('boolean');
      expect(resp_data.success).to.equal(false);
      expect(resp_data.error).to.be.an('string');
      expect(resp_data.error).to.contain('URL with id: 636cda0b011883107d392958 does not exist on the database');
    });
  });
  // eslint-disable-next-line func-names
  after(async function () {
    this.timeout(10000);
    userToDelete = await fetchUser({ username: user.username });
    if (userToDelete) { await destroyUser(userToDelete.id, true); }
  });
});
