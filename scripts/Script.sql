INSERT INTO public.tb_users
(id, email, "name", "password", "role")
values
(0, 'alex@email.com', 'alex', '$2a$10$DF9bSO6Qa34xRyVCo5CofuE2tHNNwRm64.8oRAZMdEd87jgUOwLmi', 'CLIENTE'),
(1, 'joao@email.com', 'joão', '$2a$10$DF9bSO6Qa34xRyVCo5CofuE2tHNNwRm64.8oRAZMdEd87jgUOwLmi', 'OPERADOR'),
(2, 'pedro@email.com', 'pedro', '$2a$10$DF9bSO6Qa34xRyVCo5CofuE2tHNNwRm64.8oRAZMdEd87jgUOwLmi', 'SUPERVISOR'),
(7, 'ana@email.com', 'ana', '$2a$10$DF9bSO6Qa34xRyVCo5CofuE2tHNNwRm64.8oRAZMdEd87jgUOwLmi', 'GERENTE');

"CLIENTE" | "OPERADOR" | "SUPERVISOR" | "GERENTE";

INSERT INTO public.tb_products
(id, description, "name", price)
values
(0, 'televisão', 'televisão 55 polegadas', 3000),
(1, 'monitor', 'televisão 32 polegadas', 2000);

