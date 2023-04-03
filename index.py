from flask import Flask, render_template, request, jsonify
from pytube import YouTube
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/getFilters', methods=["POST"])
def getFilters():
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

@app.route('/download',methods=["POST"])
def getVideo():
    path = 'videos/'
    
    url = request.json['url']
    itag = request.json['itag']

    if not os.path.exists(path):
        os.makedirs(path)

    yt = YouTube(url)
    stream = yt.streams.get_by_itag(itag)
    result = stream.download(path).includes_audio_track()

    return result


if __name__ == '__main__':
    app.run(debug=True)


