// import { Product } from '@/types/catalogo';
// import { Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Link from 'next/link';

// export function ProductTable({ products }: { products: Product[] }) {
//   return (
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell>ID</TableCell>
//           <TableCell>Nome</TableCell>
//           <TableCell>Preço</TableCell>
//           <TableCell>Estoque</TableCell>
//           <TableCell>Ações</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {products.map((product) => (
//           <TableRow key={product.id}>
//             <TableCell>{product.id}</TableCell>
//             <TableCell>{product.nome}</TableCell>
//             <TableCell>R$ {product.preco.toFixed(2)}</TableCell>
//             <TableCell>{product.estoque}</TableCell>
//             <TableCell>
//               <Link href={`/catalogo/${product.id}`}>
//                 <IconButton>
//                   <EditIcon />
//                 </IconButton>
//               </Link>
//               <IconButton color="error">
//                 <DeleteIcon />
//               </IconButton>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }