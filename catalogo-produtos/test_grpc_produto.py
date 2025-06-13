import grpc
from produtos_pb import produtos_pb2, produtos_pb2_grpc

def run():
    with grpc.insecure_channel('localhost:50052') as channel:
        stub = produtos_pb2_grpc.ProdutoServiceStub(channel)

        request = produtos_pb2.ProdutoRequest(id=1)
        try:
            response = stub.GetProduto(request)
            print(f"Produto encontrado: ID={response.id}, Nome={response.nome}, Preço={response.preco}")
        except grpc.RpcError as e:
            if e.code() == grpc.StatusCode.NOT_FOUND:
                print(f"Produto não encontrado: {e.details()}")
            else:
                print(f"Erro gRPC: {e.code()} - {e.details()}")

if __name__ == "__main__":
    run()
