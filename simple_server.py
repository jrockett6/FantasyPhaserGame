import SimpleHTTPServer
import SocketServer
# import socket

# host, port, ip = socket.gethostbyaddr("199.68.205.36")
# print host
# print port
# port = 8080
HOST, PORT = "localhost", 8080

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
httpd = SocketServer.TCPServer((HOST, PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()