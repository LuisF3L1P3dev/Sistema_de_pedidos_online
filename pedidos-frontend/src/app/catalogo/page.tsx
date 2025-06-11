// import { ProductTable } from '@/components/catalogo/ProductTable';
// import { Button } from '@mui/material';
// import Link from 'next/link';

// export default async function CatalogoPage() {
//   const products = await catalogApi.getAll().then(res => res.data);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Catálogo de Produtos</h1>
//         <Link href="/catalogo/new">
//           <Button variant="contained">Novo Produto</Button>
//         </Link>
//       </div>
//       <ProductTable products={products} />
//     </div>
//   );
// }