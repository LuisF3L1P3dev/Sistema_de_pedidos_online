import grpc
import produtos_pb2
import produtos_pb2_grpc

def test_get_produto(produto_id):
    channel = grpc.insecure_channel('localhost:50052')
    stub = produtos_pb2_grpc.ProdutoServiceStub(channel)
    request = produtos_pb2.ProdutoRequest(id=produto_id)
    try:
        response = stub.GetProduto(request)
        print(f"Produto encontrado: ID={response.id}, Nome={response.nome}, Preço={response.preco}")
    except grpc.RpcError as e:
        print(f"Erro: {e.code()} - {e.details()}")

if __name__ == '__main__':
    test_get_produto(4)
