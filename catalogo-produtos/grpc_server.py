import grpc
from concurrent import futures
import time

from produtos_pb import produtos_pb2, produtos_pb2_grpc

PRODUTOS_DB = {
    1: {"id": 1, "nome": "Camisa", "preco": 80.0},
    2: {"id": 2, "nome": "Calça", "preco": 70.0},
}

class ProdutoService(produtos_pb2_grpc.ProdutoServiceServicer):
    def GetProduto(self, request, context):
        produto_id = request.id
        if produto_id in PRODUTOS_DB:
            produto = PRODUTOS_DB[produto_id]
            return produtos_pb2.ProdutoResponse(
                id=produto["id"],
                nome=produto["nome"],
                preco=produto["preco"]
            )
        context.abort(grpc.StatusCode.NOT_FOUND, 'Produto não encontrado')

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    produtos_pb2_grpc.add_ProdutoServiceServicer_to_server(ProdutoService(), server)
    server.add_insecure_port('[::]:50052')
    server.start()
    print("🔌 Servidor gRPC de Produtos rodando na porta 50052")
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    serve()
