import { text } from "express";

use('Desafio-05');

print("--- Inserindo um novo usuário (se não existir) ---");
db.users.updateOne(
  { email: "teste@example.com" },
  {
    $setOnInsert: {
      username: "UsuarioTeste",
      email: "teste@example.com",
      
      role: "user",
      createdAt: new Date()
    }
  },
  { upsert: true }
);

db.users.updateOne(
  { email: "admin@example.com" },
  {
    $setOnInsert: {
      username: "AdminUser",
      email: "admin@example.com",
      role: "admin",
      createdAt: new Date()
    }
  },
  { upsert: true }
);

print("\n--- Buscando todos os usuários ---");
db.users.find({});

print("\n--- Buscando usuário por email ---");
db.users.find({ email: "teste@example.com" });

print("\n--- Atualizando o papel de um usuário ---");
db.users.updateOne(
  { email: "teste@example.com" },
  { $set: { role: "admin" } }
);

print("\n--- Verificando o papel atualizado ---");
db.users.find({ email: "teste@example.com" });

print("\n--- Inserindo alguns dados de lugares (se não existirem) ---");
db.places.updateMany(
  {
    $or: [
      { placeId: "test_place_id_1" },
      { placeId: "test_place_id_2" }
    ]
  },
  {
    $setOnInsert: {
      placeId: "test_place_id_1",
      displayName: { text: "Clínica Saúde Boa", languageCode: "pt-BR" },
      formattedAddress: "Rua Exemplo, 10, São Luís - MA",
      nationalPhoneNumber: "+5598123456789",
      municipio: "São Luís",
      category: "Clínica Geral",
      geometry: { location: { lat: -2.53073, lng: -44.3068 }, viewport: {} },
      createdAt: new Date()
    }
  },
  { upsert: true }
);

db.places.updateMany(
  { placeId: "test_place_id_2" },
  {
    $setOnInsert: {
      placeId: "test_place_id_2",
      displayName: { text: "Posto Médico Teste", languageCode: "pt-BR" },
      formattedAddress: "Av. Fictícia, 50, São José de Ribamar - MA",
      nationalPhoneNumber: "+5598987654321",
      municipio: "São José de Ribamar",
      category: "Posto de Saúde",
      geometry: { location: { lat: -2.5936, lng: -44.0531 }, viewport: {} },
      createdAt: new Date()
    }
  },
  { upsert: true }
);


db.requisitions.updateMany(
  {requisicoesId: "test_req_id" },
  {
    $setOnInsert : {
      requisicoesId: "test_req_id_2",
      municipioName: {text: "São Luís", languageCode: "pt-BR"},
      catergoriaName: {text: "Hospital", languageCode: "pt-BR"},
      bairroName: {text: "Centro", languageCode: "pt-BR"},
      unidadeName: {Text:"Hospital São Domingos", languageCode: "pt-BR"},
      createdAt : new Date()
  },
})

db.data.



print("\n--- Buscando todos os lugares ---");
db.places.find({});

print("\n--- Buscando lugares em São Luís na categoria 'Clínica Geral' ---");
db.places.find({ municipio: "São Luís", category: "Clínica Geral" });

print("\n--- Adicionando as requisições para o db  ---");

print("\n--- Contando lugares por município ---");
db.places.aggregate([
  { $group: { _id: "$municipio", count: { $sum: 1 } } }
]);


