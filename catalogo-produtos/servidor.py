from concurrent import futures
import grpc
from sqlalchemy.orm import Session
from database import SessionLocal
import produtos_pb2
import produtos_pb2_grpc
from models import Produto

class ProdutoService(produtos_pb2_grpc.ProdutoServiceServicer):
    def GetProduto(self, request, context):
        db: Session = SessionLocal()
        produto = db.query(Produto).filter(Produto.id == request.id).first()
        db.close()
        if not produto:
            context.abort(grpc.StatusCode.NOT_FOUND, "Produto não encontrado")
        return produtos_pb2.ProdutoResponse(
            id=produto.id,
            nome=produto.nome,
            preco=produto.preco
        )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    produtos_pb2_grpc.add_ProdutoServiceServicer_to_server(ProdutoService(), server)
    server.add_insecure_port('[::]:50052')
    server.start()
    print("Servidor gRPC de produtos rodando na porta 50052")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
