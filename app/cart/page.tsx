"use client";

import { useCartStore } from "@/stores/cartStore";
import CheckoutButton from "./CheckoutButton";

export default function CartPage() {
  const { items, totalPrice, itemCount, removeItem, decrementItem, addItem, clear } = useCartStore();
  return (
    <main>
      <h1>Cart</h1>
      <ul>
        {items.map((item) => (
          <li key={item.dishId}>
            {item.name} - {item.price} - {item.quantity}
            <button onClick={() => removeItem(item.dishId)}>Remove</button>
            <button onClick={() => decrementItem(item.dishId)}>Decrement</button>
            <button
              onClick={() =>
                addItem({
                  id: item.dishId,
                  name: item.name,
                  price: item.price,
                  image: "",
                  description: "",
                  restaurantId: item.restaurantId,
                })
              }
            >
              Increment
            </button>
          </li>
        ))}
        <p>Total Price: {totalPrice()}</p>
        <p>Item Count: {itemCount()}</p>
        <button onClick={() => clear()}>Clear</button>
        <CheckoutButton />
      </ul>
    </main>
  );
}
