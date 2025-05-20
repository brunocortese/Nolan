from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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
    
    def __repr__(self):
        return f'<Participant {self.nome}>'
