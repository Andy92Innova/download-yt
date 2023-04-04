from http.client import HTTPException
from flask import Flask, render_template, request, jsonify, send_file
from pytube import YouTube
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/getFilters', methods=["POST"])
def getFilters():
    try:
        url = request.json['url']

        yt = YouTube(url)
        # Obtener una lista de streams
        streams = yt.streams.filter(progressive=True)
        # Obtener una lista de diccionarios con solo los campos 'itag' y 'mime_type'
        result = [{
            'itag': stream.itag, 
            'mime_type': stream.mime_type,
            'type':stream.type,
            'subtype':stream.subtype,
            'res':stream.resolution,
            'abr':stream.abr,
            'desc':yt.title
            } for stream in streams]

        streams2 = yt.streams.filter(only_audio=True)
        # Obtener una lista de diccionarios con solo los campos 'itag' y 'mime_type'
        result2 = [{
            'itag': stream.itag, 
            'mime_type': stream.mime_type,
            'type':stream.type,
            'subtype':stream.subtype,
            'res':stream.resolution,
            'abr':stream.abr,
            'desc':yt.title
            } for stream in streams2]

        result3 = result + result2

        # Imprimir los atributos de la primera transmisión
        # result = dir(streams[0])
        return jsonify({'data':result3})
    
    except Exception as e:
        
        # Si se produce un error, lanzamos una excepción HTTPException
        raise HTTPException(status_code=500, description="No se pudo obtener los formatos")

# Este manejador de errores captura todas las excepciones HTTPException
# y las envía como una respuesta JSON con el código de estado y el mensaje de error
@app.errorhandler(HTTPException)
def handle_exception(e):
    response = jsonify(error=str(e))
    response.status_code = e.status_code
    return response



@app.route('/download',methods=["POST"])
def downloadObjeto():
    try:
        path = 'videos/'
        url = request.json['url']
        itag = request.json['itag']

        yt = YouTube(url)
        stream = yt.streams.get_by_itag(itag)
        objeto = stream.download(path)

        return send_file(objeto, as_attachment=True)
    except Exception as e:
        # Si se produce un error, lanzamos una excepción HTTPException
        raise HTTPException(status_code=500, description="No se pudo descargar el video")
    
@app.route('/helppay')
def helppay():
    return render_template('donar.html')


if __name__ == '__main__':
    # app.run(debug=True)
    app.run()


