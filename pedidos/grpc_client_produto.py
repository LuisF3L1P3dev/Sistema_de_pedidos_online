import grpc
import produtos_pb2
import produtos_pb2_grpc

class ProdutoGRPCClient:
    def __init__(self, host='localhost', port=50052):
        self.channel = grpc.insecure_channel(f'{host}:{port}')
        self.stub = produtos_pb2_grpc.ProdutoServiceStub(self.channel)

    def get_produto(self, produto_id: int):
        print(f"[gRPC] → Enviando requisição para produto_id={produto_id}")
        request = produtos_pb2.ProdutoRequest(id=produto_id)
        try:
            response = self.stub.GetProduto(request)
            print(f"[gRPC] ← Resposta recebida: id={response.id}, nome={response.nome}, preco={response.preco}")
            return {
                'id': response.id,
                'nome': response.nome,
                'preco': response.preco
            }
        except grpc.RpcError as e:
            print(f"[gRPC] ✖ Erro ao buscar produto ID={produto_id}: {e.code()} - {e.details()}")
            return None
