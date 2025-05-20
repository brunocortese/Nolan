# Guia de Deploy do Teste Nolan + Big Five

Este guia explica como publicar o site do Teste Nolan + Big Five em plataformas gratuitas de hospedagem. Escolhemos três opções populares e fáceis de usar.

## Opção 1: Deploy no Render (Recomendado)

O Render é uma plataforma moderna que oferece hospedagem gratuita para aplicações web, incluindo aplicações Flask como a nossa.

### Passo a passo:

1. **Crie uma conta no Render**
   - Acesse [render.com](https://render.com/)
   - Clique em "Sign Up" e crie uma conta (pode usar GitHub para agilizar)

2. **Crie um novo Web Service**
   - No dashboard, clique em "New" e selecione "Web Service"
   - Você pode conectar ao GitHub ou fazer upload direto dos arquivos

3. **Para upload direto:**
   - Escolha a opção "Upload Files"
   - Faça upload do arquivo ZIP com todos os arquivos do diretório `deploy-nolan-bigfive`

4. **Configure o serviço:**
   - Nome: `teste-nolan-bigfive` (ou outro de sua preferência)
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn src.main:app`
   - Plano: Free

5. **Clique em "Create Web Service"**
   - O Render vai iniciar o processo de deploy automaticamente
   - Aguarde alguns minutos até que o status mude para "Live"

6. **Acesse seu site**
   - O Render fornecerá um URL como `https://teste-nolan-bigfive.onrender.com`
   - Este é o endereço público do seu site!

## Opção 2: Deploy no Replit

O Replit é uma plataforma de desenvolvimento online que também permite hospedar aplicações web.

### Passo a passo:

1. **Crie uma conta no Replit**
   - Acesse [replit.com](https://replit.com/)
   - Clique em "Sign Up" e crie uma conta

2. **Crie um novo Repl**
   - Clique em "+ Create Repl"
   - Escolha "Python" como template
   - Dê um nome como "teste-nolan-bigfive"
   - Clique em "Create Repl"

3. **Faça upload dos arquivos**
   - No painel de arquivos à esquerda, clique com o botão direito
   - Selecione "Upload Folder" e faça upload da pasta `deploy-nolan-bigfive`
   - Ou faça upload de cada arquivo individualmente

4. **Configure o arquivo .replit**
   - Crie um arquivo chamado `.replit` na raiz do projeto
   - Adicione o seguinte conteúdo:
   ```
   run = "python -m src.main"
   ```

5. **Clique em "Run"**
   - O Replit vai instalar as dependências e iniciar o servidor
   - Você verá o site funcionando no painel de visualização

6. **Torne público**
   - Clique em "Share" no canto superior direito
   - Copie o link público para compartilhar seu site

## Opção 3: Deploy no PythonAnywhere

O PythonAnywhere é uma plataforma especializada em Python que oferece hospedagem gratuita.

### Passo a passo:

1. **Crie uma conta no PythonAnywhere**
   - Acesse [pythonanywhere.com](https://www.pythonanywhere.com/)
   - Clique em "Pricing & signup" e escolha o plano gratuito "Beginner"

2. **Faça upload dos arquivos**
   - No dashboard, vá para a seção "Files"
   - Crie uma pasta chamada `teste-nolan-bigfive`
   - Faça upload de todos os arquivos do diretório `deploy-nolan-bigfive`

3. **Configure uma nova aplicação web**
   - Vá para a seção "Web"
   - Clique em "Add a new web app"
   - Escolha "Flask" e a versão mais recente do Python
   - Caminho para o arquivo: `/home/seuusuario/teste-nolan-bigfive/src/main.py`
   - Nome da aplicação: `app`

4. **Configure o arquivo WSGI**
   - O PythonAnywhere abrirá o arquivo de configuração WSGI
   - Modifique para apontar para o seu aplicativo:
   ```python
   import sys
   path = '/home/seuusuario/teste-nolan-bigfive'
   if path not in sys.path:
       sys.path.append(path)
   from src.main import app as application
   ```

5. **Instale as dependências**
   - Vá para a seção "Consoles" e abra um console Bash
   - Execute: `pip3 install --user -r teste-nolan-bigfive/requirements.txt`

6. **Reinicie a aplicação**
   - Volte para a seção "Web"
   - Clique em "Reload"
   - Seu site estará disponível no URL fornecido (algo como `seuusuario.pythonanywhere.com`)

## Dicas importantes

1. **Banco de dados**: A aplicação está configurada para usar SQLite, que é compatível com todas as plataformas gratuitas mencionadas.

2. **Variáveis de ambiente**: Se precisar configurar variáveis de ambiente (como SECRET_KEY), consulte a documentação da plataforma escolhida.

3. **Domínio personalizado**: Todas as plataformas mencionadas permitem conectar um domínio personalizado, mas isso geralmente requer um plano pago.

4. **Limitações gratuitas**: Os planos gratuitos geralmente têm limitações de tráfego e recursos. Se seu site ganhar muitos acessos, considere migrar para um plano pago.

5. **Manutenção**: Lembre-se que algumas plataformas gratuitas (como Render) podem hibernar seu aplicativo após períodos de inatividade, o que pode causar um pequeno atraso no primeiro acesso.

## Suporte

Se encontrar dificuldades durante o processo de deploy, consulte a documentação oficial da plataforma escolhida:

- [Documentação do Render](https://render.com/docs)
- [Documentação do Replit](https://docs.replit.com/)
- [Documentação do PythonAnywhere](https://help.pythonanywhere.com/)

Boa sorte com seu projeto!
