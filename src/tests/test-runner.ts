import "dotenv/config";
import {
  burstTest,
  gradualTest,
  loadTest,
  simulateRealTimeSubmissions,
} from "./submissions";

const verifyEnvVars = () => {
  const requiredEnvVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );
  if (missingEnvVars.length > 0) {
    console.error("Missing required environment variables:", missingEnvVars);
    process.exit(1);
  }
};

const runTests = async () => {
  try {
    verifyEnvVars();

    // Get the test type from command line arguments
    const testType = process.argv[2]?.toLowerCase();

    switch (testType) {
      case "burst":
        console.log("\n=== Running Burst Test ===");
        await burstTest();
        break;

      case "gradual":
        console.log("\n=== Running Gradual Test ===");
        await gradualTest();
        break;

      case "load":
        console.log("\n=== Running Load Test ===");
        await loadTest();
        break;

      case "custom":
        console.log("\n=== Running Custom Simulation ===");
        await simulateRealTimeSubmissions(
          5000, // Total submissions
          100, // 100 submissions per batch
          1000 * 30, // 30 seconds between batches
        );
        break;

      case undefined:
      case "all":
        // Run all tests
        console.log("\n=== Running All Tests ===");
        await burstTest();
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await gradualTest();
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await loadTest();
        break;

      default:
        console.error(`Unknown test type: ${testType}`);
        console.log("Available test types: burst, gradual, load, custom, all");
        process.exit(1);
    }

    console.log("\nTest execution completed successfully");
  } catch (error) {
    console.error("Test execution failed:", error);
    process.exit(1);
  }
};

// Run tests with error handling
runTests().catch((error) => {
  console.error("Fatal error in test runner:", error);
  process.exit(1);
});
