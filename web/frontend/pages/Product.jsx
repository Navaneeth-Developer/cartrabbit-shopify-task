import React, { useEffect, useState, useCallback } from "react";
import {
  Page,
  Button,
  TextField,
  Box,
  Divider,
  Toast,
  Frame,
} from "@shopify/polaris";
import {
  GridViewOutlined,
  FormatListBulletedOutlined,
} from "@mui/icons-material";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [toastMessage, setToastMessage] = useState("");
  const [toastActive, setToastActive] = useState(false);
  const [isModified, setIsModified] = useState(false);

  // Fetch products from API (Using useCallback for optimization)
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
      setOriginalProducts(data.map((p) => ({ ...p }))); // Deep clone to prevent reference issues
    } catch (error) {
      showToast("Error fetching products!");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Function to handle title change
  const handleTitleChange = (index, newTitle) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        title: newTitle,
      };

      // Check if any titles have changed
      const modified = updatedProducts.some(
        (product, idx) => product.title !== originalProducts[idx].title
      );
      setIsModified(modified);

      return updatedProducts;
    });
  };

  // Function to update modified products only
  const updateProducts = async () => {
    const modifiedProducts = products.filter(
      (product, index) => product.title !== originalProducts[index].title
    );

    if (modifiedProducts.length === 0) {
      showToast("No changes detected!");
      return;
    }

    try {
      const response = await fetch("/api/products/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: modifiedProducts }),
      });

      if (response.ok) {
        showToast("Products updated successfully!");
        setOriginalProducts(products.map((p) => ({ ...p }))); // Reset originals
        setIsModified(false); // Disable button after update
      } else {
        showToast("Failed to update products. Please try again.");
      }
    } catch (error) {
      showToast("Error: Unable to update products.");
    }
  };

  // Toast helper function
  const showToast = (message) => {
    setToastMessage(message);
    setToastActive(true);
    setTimeout(() => setToastActive(false), 3000);
  };

  return (
    <Frame>
      <Page title="Product List">
        {/* Toggle View Mode */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          {/* <Button
            icon={
              viewMode === "list" ? (
                <GridViewOutlined style={{ fontSize: "12px" }} />
              ) : (
                <FormatListBulletedOutlined style={{ fontSize: "16px" }} />
              )
            }
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
          >
            Toggle {viewMode === "list" ? "Grid" : "List"} View
          </Button> */}
          <Button
            icon={
              viewMode === "list" ? (
                <GridViewOutlined
                  style={{ fontSize: "16px", verticalAlign: "middle" }}
                />
              ) : (
                <FormatListBulletedOutlined
                  style={{ fontSize: "16px", verticalAlign: "middle" }}
                />
              )
            }
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            // fullWidth // Makes the button take up full space if needed
            monochrome // Ensures a cleaner look with icon and text
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              Toggle {viewMode === "list" ? "Grid" : "List"} View
            </span>
          </Button>
        </div>

        {/* Product List */}
        <div
          style={{
            display: viewMode === "grid" ? "grid" : "block",
            gridTemplateColumns:
              viewMode === "grid"
                ? "repeat(auto-fit, minmax(250px, 1fr))"
                : "none",
            gap: "20px",
            padding: "20px",
            margin: "8px 0px",
            background: "#f9fafb",
          }}
        >
          {products.length > 0 ? (
            products.map((product, index) => (
              <Box
                key={product.id}
                style={{
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  background: "linear-gradient(135deg, #000000, #434343)",
                  color: "white",
                  margin: "12px 0px",
                  height: "200px",
                  overflow: "auto",
                }}
                padding="400"
              >
                <TextField
                  label={<span style={{ fontWeight: "bold" }}>Title</span>}
                  value={product.title}
                  onChange={(newTitle) => handleTitleChange(index, newTitle)}
                />
                <Divider />
                <strong>Variants:</strong>
                {product.variants.edges.map(({ node }) => (
                  <Box key={node.id} padding="200">
                    <span>
                      SKU: {node.sku || "N/A"} | Price: ${node.price}
                    </span>
                  </Box>
                ))}
              </Box>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>

        {/* Update Button Below Product List (Disabled Until Changes Are Made) */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <Button onClick={updateProducts} disabled={!isModified}>
            Update Titles
          </Button>
        </div>

        {/* Toast Notification for Success & Failure */}
        {toastActive && (
          <Toast
            content={toastMessage}
            onDismiss={() => setToastActive(false)}
          />
        )}
      </Page>
    </Frame>
  );
};

export default Product;
