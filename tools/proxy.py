#!/usr/bin/env python3
"""
Proxy simple para evitar problemas de CORS con Ollama
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request
import urllib.parse
import json
import sys

class OllamaProxy(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/generate':
            # Leer el cuerpo de la petición
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                # Reenviar la petición a Ollama
                ollama_url = 'http://localhost:11434/api/generate'
                req = urllib.request.Request(
                    ollama_url,
                    data=post_data,
                    headers={
                        'Content-Type': 'application/json',
                        'User-Agent': 'Ollama-Proxy/1.0'
                    }
                )
                
                with urllib.request.urlopen(req) as response:
                    response_data = response.read()
                    
                    # Enviar respuesta al cliente
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
                    self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                    self.end_headers()
                    self.wfile.write(response_data)
                    
            except Exception as e:
                # Enviar error
                error_response = {
                    'error': str(e),
                    'message': 'Error al conectar con Ollama'
                }
                
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(error_response).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        # Manejar preflight CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        # Log personalizado
        print(f"[{self.address_string()}] {format % args}")

def main():
    port = 8080
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    
    server_address = ('', port)
    httpd = HTTPServer(server_address, OllamaProxy)
    
    print(f"🚀 Proxy Ollama ejecutándose en http://localhost:{port}")
    print(f"📡 Reenviando peticiones a http://localhost:11434")
    print(f"🛑 Presiona Ctrl+C para detener")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Proxy detenido")
        httpd.server_close()

if __name__ == '__main__':
    main() 