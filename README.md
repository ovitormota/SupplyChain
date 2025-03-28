
# Backend - Python & Flask

Este é o backend do projeto, desenvolvido com Python e Flask, para gerenciar as operações de entrada e saída de produtos.

## Pré-requisitos

Antes de começar, verifique se você tem as seguintes ferramentas instaladas:

- [Python 3.x](https://www.python.org/downloads/)
- [Docker](https://www.docker.com/get-started)

## Instalação

1. Clone o repositório para o seu diretório local:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd <DIRETORIO_DO_REPOSITORIO>
   ```

2. Crie um ambiente virtual para o projeto (opcional, mas recomendado):

   ```bash
   python3 -m venv venv
   source venv/bin/activate   # No Windows use: venv\Scripts\activate
   ```

3. Instale as dependências necessárias:

   ```bash
   pip install -r requirements.txt
   ```

## Rodando o Docker

1. No diretório raiz do projeto, execute o seguinte comando para iniciar os containers usando o `docker-compose`:

   ```bash
   docker-compose up --build
   ```

   Este comando irá construir e rodar os containers para o backend e banco de dados. O Flask será exposto na porta configurada.

   Após a execução, o backend estará disponível no endereço `http://localhost:5000` (ou na porta configurada no arquivo `docker-compose.yml`).

## Adicionando Dados Fictícios

Para adicionar dados de exemplo (fake), você pode rodar o script `generate_dummy_data.py`. Ele cria dados de teste para os produtos, entradas e saídas.

1. Após garantir que os containers estão rodando, execute o seguinte comando para rodar o script:

   ```bash
   python generate_dummy_data.py
   ```

   Isso irá gerar dados fictícios no banco de dados configurado.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
