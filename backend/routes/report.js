const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Customer = require('../models/Customer');

/// Báo cáo doanh thu
router.get('/revenue', async (req, res) => {
  let { startDate, endDate } = req.query;

  // Xử lý ngày mặc định nếu không được truyền vào
  if (!startDate || !endDate) {
    const today = new Date();
    startDate = new Date(today.setHours(0, 0, 0, 0));
    endDate = new Date(today.setHours(23, 59, 59, 999));
  } else {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
  }

  try {
    const revenueData = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startDate, $lte: endDate },
          status: "Đã giao hàng", // Chỉ tính các đơn hàng có trạng thái "Đã giao hàng"
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.json({ revenueByDate: revenueData });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    res.status(500).json({ message: 'Error fetching revenue data.' });
  }
});



router.get('/inventory-extremes', async (req, res) => {
  try {
    // Lấy 5 nguyên liệu tồn ít nhất
    const lowInventoryData = await Inventory.find({})
      .select('inventoryId name unit stockQuantity lastUpdated')
      .sort({ stockQuantity: 1 })
      .limit(5);

    // Lấy 5 nguyên liệu tồn nhiều nhất
    const highInventoryData = await Inventory.find({})
      .select('inventoryId name unit stockQuantity lastUpdated')
      .sort({ stockQuantity: -1 })
      .limit(5);

    res.json({
      lowInventory: lowInventoryData,
      highInventory: highInventoryData,
    });
  } catch (error) {
    console.error('Error fetching inventory extremes:', error);
    res.status(500).json({ message: 'Error fetching inventory extremes.' });
  }
});



// Báo cáo sản phẩm bán chạy
router.get('/best-selling-products', async (req, res) => {
  try {
    const bestSellingProducts = await Order.aggregate([
      { $unwind: "$items" }, // Giải nén mảng items trong mỗi đơn hàng
      { 
        $group: {
          _id: "$items.productId", // Nhóm theo productId
          quantitySold: { $sum: "$items.quantity" }, // Tính tổng số lượng bán ra
        }
      },
      { $sort: { quantitySold: -1 } }, // Sắp xếp theo số lượng bán được
      { $limit: 5 }, // Giới hạn chỉ lấy 5 sản phẩm bán chạy nhất
      {
        $lookup: {
          from: "products", // Tìm trong collection 'products'
          localField: "_id", // Khớp với _id trong kết quả group (productId từ đơn hàng)
          foreignField: "_id", // So sánh với _id trong collection 'products'
          as: "productDetails" // Thêm thông tin sản phẩm vào mảng 'productDetails'
        }
      },
      { $unwind: "$productDetails" }, // Giải nén mảng productDetails để lấy thông tin chi tiết sản phẩm
      {
        $project: { // Chọn các trường cần hiển thị
          productId: "$productDetails.productId",  // Id của sản phẩm
          productName: "$productDetails.name",  // Tên sản phẩm
          price: "$productDetails.price", // Giá sản phẩm
          quantitySold: 1, // Số lượng đã bán
        }
      }
    ]);

    // Kiểm tra xem có sản phẩm bán chạy không
    if (bestSellingProducts.length === 0) {
      return res.status(404).json({ message: 'No best-selling products found.' });
    }

    res.json(bestSellingProducts);
  } catch (error) {
    console.error('Error fetching best-selling products data:', error);
    res.status(500).json({ message: 'Error fetching best-selling products data.' });
  }
});

router.get("/top-customers", async (req, res) => {
  try {
    // Lấy tất cả khách hàng
    const customers = await Customer.find();

    // Tính tổng chi tiêu cho từng khách hàng
    const customersWithTotalSpend = await Promise.all(customers.map(async (customer) => {
      // Lấy tất cả đơn hàng của khách hàng dựa trên idCustomer
      const orders = await Order.find({ customerId: customer.idCustomer });

      // Tính tổng chi tiêu của khách hàng từ các đơn hàng
      const totalSpend = orders.reduce((sum, order) => sum + order.totalAmount, 0);

      return {
        idCustomer: customer.idCustomer,
        name: customer.name,
        email: customer.email,
        totalSpend
      };
    }));

    // Sắp xếp khách hàng theo tổng chi tiêu giảm dần và lấy 10 khách hàng đầu
    const topCustomers = customersWithTotalSpend
      .sort((a, b) => b.totalSpend - a.totalSpend)  // Sắp xếp theo tổng chi tiêu
      .slice(0, 10);  // Lấy 10 khách hàng đầu

    res.json(topCustomers);
  } catch (error) {
    console.error('Error fetching top customers:', error);
    res.status(500).send('Server Error');
  }
});



module.exports = router;





