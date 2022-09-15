import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database";


beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items`;
});

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const body = {
      title: "iPhone 14 Pro - Preto-espacial",
      url: "https://www.apple.com/br/shop/buy-iphone/iphone-14-pro/tela-de-6,1-polegadas-256gb-preto-espacial",
      description: "Novíssimo iPhone com recursos de última geração",
      amount: 1049900
    }
    const response = await supertest(app).post('/items').send(body);
    expect(response.status).toEqual(201);
  });
  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const body = {
      title: "iPhone 14 Pro - Preto-espacial",
      url: "https://www.apple.com/br/shop/buy-iphone/iphone-14-pro/tela-de-6,1-polegadas-256gb-preto-espacial",
      description: "Novíssimo iPhone com recursos de última geração",
      amount: 1049900
    }
    await supertest(app).post('/items').send(body);
    const response = await supertest(app).post('/items').send(body);
    expect(response.status).toEqual(409);
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const body = {
      title: "iPhone 14 Pro - Preto-espacial",
      url: "https://www.apple.com/br/shop/buy-iphone/iphone-14-pro/tela-de-6,1-polegadas-256gb-preto-espacial",
      description: "Novíssimo iPhone com recursos de última geração",
      amount: 1049900
    }
    await supertest(app).post('/items').send(body);
    const response = await supertest(app).get("/items");
    expect(response.status).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const body = {
      title: "iPhone 14 Pro - Preto-espacial",
      url: "https://www.apple.com/br/shop/buy-iphone/iphone-14-pro/tela-de-6,1-polegadas-256gb-preto-espacial",
      description: "Novíssimo iPhone com recursos de última geração",
      amount: 1049900
    }
    await supertest(app).post('/items').send(body);
    const items = await supertest(app).get("/items");
    const itemId = items.body[0].id;
    const response = await supertest(app).get(`/items/${itemId}`);
    expect(response.status).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });
  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
    const response = await supertest(app).get("/items/1");
    expect(response.status).toEqual(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect()
})