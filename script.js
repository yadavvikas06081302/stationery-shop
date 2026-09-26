const products=[
{id:1,name:"Premium Ball Pen",cat:"Writing",price:20,emoji:"🖊️"},
{id:2,name:"Blue Gel Pen Pack",cat:"Writing",price:60,emoji:"🖊️"},
{id:3,name:"HB Pencil Set",cat:"Writing",price:35,emoji:"✏️"},
{id:4,name:"A4 Spiral Notebook",cat:"Notebooks",price:90,emoji:"📓"},
{id:5,name:"Classmate Notebook",cat:"Notebooks",price:70,emoji:"📒"},
{id:6,name:"Hardbound Notebook",cat:"Notebooks",price:140,emoji:"📕"},
{id:7,name:"Color Pencil Set",cat:"Art",price:120,emoji:"🖍️"},
{id:8,name:"Sketch Pens",cat:"Art",price:85,emoji:"🖍️"},
{id:9,name:"Water Color Set",cat:"Art",price:150,emoji:"🎨"},
{id:10,name:"Geometry Box",cat:"Office",price:110,emoji:"📐"},
{id:11,name:"Stapler",cat:"Office",price:75,emoji:"📎"},
{id:12,name:"A4 File Folder",cat:"Office",price:45,emoji:"📁"}
];

let cart=JSON.parse(localStorage.getItem("stationeryCart")||"[]");
let activeCat="All";

const grid=document.getElementById("productGrid");
const search=document.getElementById("search");

function money(n){return "₹"+n.toLocaleString("en-IN")}
function renderProducts(){
  const q=search.value.toLowerCase().trim();
  const list=products.filter(p=>(activeCat==="All"||p.cat===activeCat)&&p.name.toLowerCase().includes(q));
  grid.innerHTML=list.length?list.map(p=>`
    <article class="card">
      <div class="pic">${p.emoji}</div>
      <div class="category">${p.cat}</div>
      <h3>${p.name}</h3>
      <div class="price">${money(p.price)}</div>
      <button class="add" onclick="addToCart(${p.id})">Add to Cart</button>
    </article>`).join(""):`<div class="empty">No products found.</div>`;
}
function save(){localStorage.setItem("stationeryCart",JSON.stringify(cart))}
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++; else cart.push({id,qty:1});
  save();renderCart();openCart();
}
function changeQty(id,d){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=d;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  save();renderCart();
}
function renderCart(){
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML="<p style='text-align:center;color:#687386;padding:40px 0'>Your cart is empty.</p>";}
  else box.innerHTML=cart.map(c=>{const p=products.find(x=>x.id===c.id);return `
    <div class="cart-item">
      <div class="emoji">${p.emoji}</div><div class="info"><b>${p.name}</b><br>${money(p.price)} × ${c.qty}</div>
      <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button> ${c.qty} <button onclick="changeQty(${p.id},1)">+</button></div>
    </div>`}).join("");
  const total=cart.reduce((s,c)=>s+products.find(p=>p.id===c.id).price*c.qty,0);
  document.getElementById("cartTotal").textContent=money(total);
  document.getElementById("cartCount").textContent=cart.reduce((s,c)=>s+c.qty,0);
}
function openCart(){document.getElementById("cartPanel").classList.add("open");document.getElementById("overlay").classList.remove("hidden")}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");document.getElementById("overlay").classList.add("hidden")}
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
search.addEventListener("input",renderProducts);
document.querySelectorAll(".cat").forEach(b=>b.onclick=()=>{document.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeCat=b.dataset.cat;renderProducts()});

document.getElementById("checkoutBtn").onclick=()=>{
 if(!cart.length){alert("Please add a product to the cart first.");return}
 document.getElementById("orderSummary").textContent=`${cart.reduce((s,c)=>s+c.qty,0)} item(s) selected • Total ${document.getElementById("cartTotal").textContent}`;
 document.getElementById("checkoutModal").classList.remove("hidden");
};
document.getElementById("closeModal").onclick=()=>document.getElementById("checkoutModal").classList.add("hidden");

document.getElementById("orderForm").onsubmit=(e)=>{
 e.preventDefault();
 const orderNo="VS"+Date.now().toString().slice(-6);
 const name=document.getElementById("name").value;
 document.getElementById("success").innerHTML=`✅ <b>Order placed!</b><br>Thank you, ${name}.<br>Your order number is <b>${orderNo}</b>.<br><br>For a real business, connect this form to your backend/WhatsApp/payment gateway before accepting live orders.`;
 document.getElementById("success").classList.remove("hidden");
 cart=[];save();renderCart();
 e.target.classList.add("hidden");
};

renderProducts();renderCart();
