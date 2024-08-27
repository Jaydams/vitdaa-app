import React, { useState, useEffect } from "react";
import { supabase } from "../../src/lib/helper/supabaseClient";

const Dashboard = () => {
  const [menuName, setMenuName] = useState("");
  const [menuId, setMenuId] = useState(null);
  const [menus, setMenus] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndMenus = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUser(user);

        if (user) {
          const { data: menus, error: menusError } = await supabase
            .from("menu")
            .select("*")
            .eq("owner_id", user.id);

          if (menusError) throw menusError;
          setMenus(menus);
        }
      } catch (error) {
        setError("Error fetching data: " + error.message);
      }
    };

    fetchUserAndMenus();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (menuId) {
        const { data: items, error: itemsError } = await supabase
          .from("menu_items")
          .select("*")
          .eq("menu_id", menuId);

        if (itemsError) {
          setError("Error fetching menu items: " + itemsError.message);
        } else {
          setMenuItems(items);
        }
      }
    };

    fetchMenuItems();
  }, [menuId]);

  const uploadImage = async () => {
    if (!imageFile) {
      setError("No image file selected.");
      return null;
    }

    const fileName = `${user.id}-${Date.now()}.${imageFile.name
      .split(".")
      .pop()}`;
    const filePath = `public/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from("menu-images")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading image:", error);
        setError("Image upload failed: " + error.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from("menu-images")
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error("Error getting public URL:", publicUrlData);
        setError("Failed to retrieve public URL for the image.");
        return null;
      }

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Unexpected error during image upload:", err);
      setError("Unexpected error during image upload: " + err.message);
      return null;
    }
  };

  const handleMenuItemCreation = async (e) => {
    e.preventDefault();

    if (!user || !menuId) {
      setError("Menu or user not authenticated");
      return;
    }

    const imageUrl = await uploadImage();

    if (!imageUrl) {
      setError("Image upload failed. Cannot proceed with item creation.");
      return;
    }

    const { data, error } = await supabase.from("menu_items").insert([
      {
        menu_id: menuId,
        name: newMenuItem.name,
        description: newMenuItem.description,
        price: parseFloat(newMenuItem.price),
        image_url: imageUrl,
      },
    ]);

    if (error) {
      console.error("Error inserting menu item:", error);
      setError("Error creating menu item: " + error.message);
      return;
    }

    setNewMenuItem({ name: "", description: "", price: "", image_url: "" });
    setImageFile(null);
    alert("Menu item created successfully!");

    // Re-fetch menu items after creation
    const { data: updatedMenuItems, error: fetchError } = await supabase
      .from("menu_items")
      .select("*")
      .eq("menu_id", menuId);

    if (fetchError) {
      console.error("Error fetching updated menu items:", fetchError);
      setError("Error fetching updated menu items: " + fetchError.message);
    } else {
      setMenuItems(updatedMenuItems);
    }
  };

  const handleMenuCreation = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("User not authenticated");
      return;
    }

    const { error } = await supabase.from("menu").insert([
      {
        owner_id: user.id,
        menu_name: menuName,
      },
    ]);

    if (error) {
      setError("Error creating menu: " + error.message);
    } else {
      setMenuName("");
      setError("");
      alert("Menu created successfully!");

      const { data: updatedMenus, error: fetchError } = await supabase
        .from("menu")
        .select("*")
        .eq("owner_id", user.id);

      if (fetchError) {
        setError("Error fetching updated menus: " + fetchError.message);
      } else {
        setMenus(updatedMenus);
      }
    }
  };

  const deleteMenu = async (menuId) => {
    const { error } = await supabase.from("menu").delete().eq("id", menuId);

    if (error) {
      console.error("Error deleting menu:", error);
      setError("Error deleting menu: " + error.message);
      return;
    }

    // Fetch updated menus
    const { data: updatedMenus, error: fetchError } = await supabase
      .from("menu")
      .select("*")
      .eq("owner_id", user.id);

    if (fetchError) {
      console.error("Error fetching updated menus:", fetchError);
      setError("Error fetching updated menus: " + fetchError.message);
    } else {
      setMenus(updatedMenus);
      setMenuItems([]);
      setMenuId(null);
      alert("Menu deleted successfully!");
    }
  };

  const deleteMenuItem = async (itemId) => {
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      console.error("Error deleting menu item:", error);
      setError("Error deleting menu item: " + error.message);
      return;
    }

    // Re-fetch menu items after deletion
    const { data: updatedMenuItems, error: fetchError } = await supabase
      .from("menu_items")
      .select("*")
      .eq("menu_id", menuId);

    if (fetchError) {
      console.error("Error fetching updated menu items:", fetchError);
      setError("Error fetching updated menu items: " + fetchError.message);
    } else {
      setMenuItems(updatedMenuItems);
      alert("Menu item deleted successfully!");
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <form onSubmit={handleMenuCreation}>
        <label htmlFor="menuName">Menu Name:</label>
        <input
          id="menuName"
          type="text"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          required
        />
        <button type="submit">Create Menu</button>
        {error && <p>{error}</p>}
      </form>

      <div>
        <h2>Menus</h2>
        <select
          onChange={(e) => setMenuId(e.target.value)}
          value={menuId || ""}
        >
          <option value="" disabled>
            Select a menu
          </option>
          {menus.map((menu) => (
            <option key={menu.id} value={menu.id}>
              {menu.menu_name}
            </option>
          ))}
        </select>

        {menus.map((menu) => (
          <div key={menu.id}>
            <span>{menu.menu_name}</span>
            <button onClick={() => deleteMenu(menu.id)}>Delete Menu</button>
          </div>
        ))}
      </div>

      {menuId && (
        <div>
          <h2>Add Menu Item</h2>
          <form onSubmit={handleMenuItemCreation}>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              required
            />
            <label htmlFor="itemName">Name:</label>
            <input
              id="itemName"
              type="text"
              value={newMenuItem.name}
              onChange={(e) =>
                setNewMenuItem({ ...newMenuItem, name: e.target.value })
              }
              required
            />
            <label htmlFor="itemDescription">Description:</label>
            <textarea
              id="itemDescription"
              value={newMenuItem.description}
              onChange={(e) =>
                setNewMenuItem({ ...newMenuItem, description: e.target.value })
              }
              required
            />
            <label htmlFor="itemPrice">Price:</label>
            <input
              id="itemPrice"
              type="number"
              step="0.01"
              value={newMenuItem.price}
              onChange={(e) =>
                setNewMenuItem({ ...newMenuItem, price: e.target.value })
              }
              required
            />
            <button type="submit">Add Item</button>
            {error && <p>{error}</p>}
          </form>

          <h2>Menu Items</h2>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <div>{item.description}</div>
                <img src={item.image_url} alt="" />
                <button onClick={() => deleteMenuItem(item.id)}>
                  Delete Item
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
