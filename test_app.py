import requests
import json
import time

def test_backend():
    """Test the backend API endpoints"""
    base_url = "http://localhost:8000"
    
    print("Testing AI Lead Scoring Dashboard Backend...")
    print("=" * 50)
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print("❌ Health check failed")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    # Test scoring endpoint
    test_data = {
        "age": 25,
        "job": "admin.",
        "marital": "single",
        "education": "secondary",
        "default": "no",
        "balance": 1000.0,
        "housing": "yes",
        "loan": "no",
        "contact": "unknown",
        "duration": 300,
        "campaign": 1,
        "pdays": -1,
        "previous": 0,
        "poutcome": "unknown",
        "comments": "I am very interested in this investment opportunity!",
        "email": "test@example.com",
        "phone": "+91-9876543210",
        "consent": True
    }
    
    try:
        response = requests.post(f"{base_url}/score", json=test_data)
        if response.status_code == 200:
            result = response.json()
            print("✅ Lead scoring test passed")
            print(f"   Initial Score: {result['initial_score']}")
            print(f"   Reranked Score: {result['reranked_score']}")
            print(f"   Message: {result['message']}")
            
            # Check if reranker worked
            if result['reranked_score'] != result['initial_score']:
                print("✅ LLM reranker is working (scores differ)")
            else:
                print("⚠️  LLM reranker may not have adjusted score")
        else:
            print(f"❌ Lead scoring failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Lead scoring error: {e}")
        return False
    
    # Test leads endpoint
    try:
        response = requests.get(f"{base_url}/leads")
        if response.status_code == 200:
            leads = response.json()
            print(f"✅ Leads endpoint working ({len(leads)} leads)")
        else:
            print(f"❌ Leads endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Leads endpoint error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Backend testing completed successfully!")
    print("\nYou can now:")
    print("1. Open http://localhost:3000 in your browser")
    print("2. Fill out the lead form")
    print("3. Submit and see the scoring results")
    print("4. View the table and charts")
    
    return True

if __name__ == "__main__":
    print("Waiting for backend to start...")
    time.sleep(3)  # Give backend time to start
    test_backend() 