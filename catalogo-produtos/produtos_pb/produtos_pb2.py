# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: produtos.proto
# Protobuf Python Version: 6.31.0
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    6,
    31,
    0,
    '',
    'produtos.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x0eprodutos.proto\x12\x08produtos\"\x1c\n\x0eProdutoRequest\x12\n\n\x02id\x18\x01 \x01(\x05\":\n\x0fProdutoResponse\x12\n\n\x02id\x18\x01 \x01(\x05\x12\x0c\n\x04nome\x18\x02 \x01(\t\x12\r\n\x05preco\x18\x03 \x01(\x02\x32S\n\x0eProdutoService\x12\x41\n\nGetProduto\x12\x18.produtos.ProdutoRequest\x1a\x19.produtos.ProdutoResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'produtos_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_PRODUTOREQUEST']._serialized_start=28
  _globals['_PRODUTOREQUEST']._serialized_end=56
  _globals['_PRODUTORESPONSE']._serialized_start=58
  _globals['_PRODUTORESPONSE']._serialized_end=116
  _globals['_PRODUTOSERVICE']._serialized_start=118
  _globals['_PRODUTOSERVICE']._serialized_end=201
# @@protoc_insertion_point(module_scope)
