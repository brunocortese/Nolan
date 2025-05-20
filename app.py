import os
import sys
import json
from flask import Flask, send_from_directory, request, jsonify
from flask_sqlalchemy import SQLAlchemy

# Criar a aplicação Flask
app = Flask(__name__, static_folder='.src/static')
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Configuração do banco de dados SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///nolan_bigfive.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar o banco de dados
db = SQLAlchemy(app)

# Definir o modelo Participant
class Participant(db.Model):
    __tablename__ = 'participants'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    cpf = db.Column(db.String(14), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    genero = db.Column(db.String(20), nullable=False)
    faixa_etaria = db.Column(db.String(10), nullable=False)
    
    # Resultados do Diagrama de Nolan
    nolan_x = db.Column(db.Float)
    nolan_y = db.Column(db.Float)
    
    # Resultados do Big Five
    abertura = db.Column(db.Float)
    conscienciosidade = db.Column(db.Float)
    extroversao = db.Column(db.Float)
    amabilidade = db.Column(db.Float)
    neuroticismo = db.Column(db.Float)
    
    # Respostas às perguntas (armazenadas como JSON)
    respostas = db.Column(db.Text)
    
    # Timestamp
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

# Criar todas as tabelas
with app.app_context():
    db.create_all()

# Rotas da API
@app.route('/api/cadastro', methods=['POST'])
def cadastro():
    data = request.json
    
    # Verificar se o CPF ou e-mail já existem
    existing_participant = Participant.query.filter(
        (Participant.cpf == data['cpf']) | 
        (Participant.email == data['email'])
    ).first()
    
    if existing_participant:
        return jsonify({'success': False, 'message': 'CPF ou e-mail já cadastrado'}), 400
    
    # Criar novo participante
    new_participant = Participant(
        nome=data['nome'],
        cpf=data['cpf'],
        email=data['email'],
        genero=data['genero'],
        faixa_etaria=data['faixa_etaria']
    )
    
    db.session.add(new_participant)
    db.session.commit()
    
    return jsonify({'success': True, 'participant_id': new_participant.id}), 201

@app.route('/api/resultado', methods=['POST'])
def resultado():
    data = request.json
    participant_id = data['participant_id']
    
    participant = Participant.query.get(participant_id)
    if not participant:
        return jsonify({'success': False, 'message': 'Participante não encontrado'}), 404
    
    # Armazenar respostas
    participant.respostas = json.dumps(data['respostas'])
    
    # Calcular resultados do Diagrama de Nolan
    nolan_x = calcular_nolan_x(data['respostas'])
    nolan_y = calcular_nolan_y(data['respostas'])
    
    # Calcular resultados do Big Five
    abertura = calcular_abertura(data['respostas'])
    conscienciosidade = calcular_conscienciosidade(data['respostas'])
    extroversao = calcular_extroversao(data['respostas'])
    amabilidade = calcular_amabilidade(data['respostas'])
    neuroticismo = calcular_neuroticismo(data['respostas'])
    
    # Atualizar participante
    participant.nolan_x = nolan_x
    participant.nolan_y = nolan_y
    participant.abertura = abertura
    participant.conscienciosidade = conscienciosidade
    participant.extroversao = extroversao
    participant.amabilidade = amabilidade
    participant.neuroticismo = neuroticismo
    
    db.session.commit()
    
    # Determinar zona do diagrama de Nolan
    zona = determinar_zona_nolan(nolan_x, nolan_y)
    
    return jsonify({
        'success': True,
        'nolan_x': nolan_x,
        'nolan_y': nolan_y,
        'zona': zona,
        'abertura': abertura,
        'conscienciosidade': conscienciosidade,
        'extroversao': extroversao,
        'amabilidade': amabilidade,
        'neuroticismo': neuroticismo
    }), 200

@app.route('/api/export', methods=['GET'])
def export_data():
    participants = Participant.query.all()
    result = []
    
    for p in participants:
        result.append({
            'Nome': p.nome,
            'CPF': p.cpf,
            'E-mail': p.email,
            'Gênero': p.genero,
            'Faixa Etária': p.faixa_etaria,
            'Nolan_X': p.nolan_x,
            'Nolan_Y': p.nolan_y,
            'Abertura': p.abertura,
            'Conscienciosidade': p.conscienciosidade,
            'Extroversão': p.extroversao,
            'Amabilidade': p.amabilidade,
            'Neuroticismo': p.neuroticismo,
            'Timestamp': p.timestamp.strftime('%Y-%m-%d %H:%M:%S') if p.timestamp else ''
        })
    
    return jsonify(result), 200

# Funções de cálculo do Diagrama de Nolan
def calcular_nolan_x(respostas):
    # Eixo X (Econômico): Perguntas 1, 3, 5, 9, 14, 19
    perguntas_eixo_x = [1, 3, 5, 9, 14, 19]
    pontos = 0
    
    for pergunta in perguntas_eixo_x:
        resposta = int(respostas.get(str(pergunta), 3))  # Valor padrão: neutro (3)
        # Converter escala de 1-5 para -2 a +2
        pontos += resposta - 3
    
    # Normalizar para escala -10 a +10
    return (pontos / len(perguntas_eixo_x)) * (10 / 2)

def calcular_nolan_y(respostas):
    # Eixo Y (Valores): Perguntas 6, 7, 8, 11, 13, 16
    perguntas_eixo_y = [6, 7, 8, 11, 13, 16]
    pontos = 0
    
    for pergunta in perguntas_eixo_y:
        resposta = int(respostas.get(str(pergunta), 3))  # Valor padrão: neutro (3)
        # Converter escala de 1-5 para -2 a +2
        pontos += resposta - 3
    
    # Normalizar para escala -10 a +10
    return (pontos / len(perguntas_eixo_y)) * (10 / 2)

def determinar_zona_nolan(x, y):
    if x >= 0 and y >= 0:
        return "Direita Liberal"
    elif x >= 0 and y < 0:
        return "Direita Conservadora"
    elif x < 0 and y >= 0:
        return "Esquerda Liberal"
    else:
        return "Esquerda Conservadora"

# Funções de cálculo do Big Five
def calcular_abertura(respostas):
    # Abertura: 8, 10, 13, 20
    perguntas = [8, 10, 13, 20]
    return calcular_media_percentual(respostas, perguntas)

def calcular_conscienciosidade(respostas):
    # Conscienciosidade: 12, 15, 17
    perguntas = [12, 15, 17]
    return calcular_media_percentual(respostas, perguntas)

def calcular_extroversao(respostas):
    # Extroversão: 2, 13, 17
    perguntas = [2, 13, 17]
    return calcular_media_percentual(respostas, perguntas)

def calcular_amabilidade(respostas):
    # Amabilidade: 6, 10, 18
    perguntas = [6, 10, 18]
    return calcular_media_percentual(respostas, perguntas)

def calcular_neuroticismo(respostas):
    # Neuroticismo: 4, 15, 19
    perguntas = [4, 15, 19]
    return calcular_media_percentual(respostas, perguntas)

def calcular_media_percentual(respostas, perguntas):
    pontos = 0
    for pergunta in perguntas:
        resposta = int(respostas.get(str(pergunta), 3))  # Valor padrão: neutro (3)
        pontos += resposta
    
    # Converter para percentual (1-5 para 0-100%)
    return ((pontos / (len(perguntas) * 5)) * 100)

# Rota para servir arquivos estáticos
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

# Iniciar o servidor
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
