from concurrent import futures
import grpc
from sqlalchemy.orm import Session
from database import SessionLocal
import clientes_pb2
import clientes_pb2_grpc
from models import Cliente
# from produtos_pb import produtos_pb2, produtos_pb2_grpc

class ClienteService(clientes_pb2_grpc.ClienteServiceServicer):
    def GetCliente(self, request, context):
        print(f"[gRPC CLIENTES] ➡️ Recebido request com ID={request.id}")
        db: Session = SessionLocal()
        cliente = db.query(Cliente).filter(Cliente.id == request.id).first()
        db.close()
        if not cliente:
            print(f"[gRPC CLIENTES] ❌ Cliente com ID={request.id} não encontrado")
            context.abort(grpc.StatusCode.NOT_FOUND, "Cliente não encontrado")
        print(f"[gRPC CLIENTES] ✅ Cliente encontrado: {cliente.nome}")
        return clientes_pb2.ClienteResponse(
            id=cliente.id,
            nome=cliente.nome,
            email=cliente.email
        )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    clientes_pb2_grpc.add_ClienteServiceServicer_to_server(ClienteService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("gRPC server rodando na porta 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()