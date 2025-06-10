import grpc
import clientes_pb2
import clientes_pb2_grpc

class ClienteGRPCClient:
    def __init__(self, host='localhost', port=50051):
        self.channel = grpc.insecure_channel(f'{host}:{port}')
        self.stub = clientes_pb2_grpc.ClienteServiceStub(self.channel)

    def get_cliente(self, cliente_id: int):
        request = clientes_pb2.ClienteRequest(id=cliente_id)
        try:
            response = self.stub.GetCliente(request)
            return {
                'id': response.id,
                'nome': response.nome,
                'email': response.email
            }
        except grpc.RpcError as e:
            print(f"gRPC error: {e.code()} - {e.details()}")
            return None
