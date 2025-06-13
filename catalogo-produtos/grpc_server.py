import grpc
from concurrent import futures
import time

from produtos_pb import produtos_pb2, produtos_pb2_grpc

from database import SessionLocal
from models import Produto

class ProdutoService(produtos_pb2_grpc.ProdutoServiceServicer):
    def GetProduto(self, request, context):
        produto_id = request.id
        db = SessionLocal()
        try:
            produto = db.query(Produto).filter(Produto.id == produto_id).first()
            if produto:
                return produtos_pb2.ProdutoResponse(
                    id=produto.id,
                    nome=produto.nome,
                    preco=produto.preco
                )
            else:
                context.abort(grpc.StatusCode.NOT_FOUND, f'Produto com ID {produto_id} não encontrado via gRPC')
        finally:
            db.close()

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
