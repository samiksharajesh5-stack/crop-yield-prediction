import sys, json, joblib, numpy as np, os

BASE = os.path.dirname(os.path.abspath(__file__))

def predict(data):
    model   = joblib.load(os.path.join(BASE, 'model.pkl'))
    le_soil = joblib.load(os.path.join(BASE, 'le_soil.pkl'))
    le_crop = joblib.load(os.path.join(BASE, 'le_crop.pkl'))
    le_fert = joblib.load(os.path.join(BASE, 'le_fert.pkl'))

    temp     = float(data['temperature'])
    rainfall = float(data['rainfall'])
    humidity = float(data['humidity'])
    area     = float(data['area'])

    soil = le_soil.transform([data['soil_type']])[0]
    crop = le_crop.transform([data['crop_type']])[0]
    fert = le_fert.transform([data['fertilizer']])[0]

    X = np.array([[temp, rainfall, humidity, soil, crop, fert, area]])
    y = float(model.predict(X)[0])

    baseline = 9.09
    pct = (y / baseline) * 100
    if pct >= 150:   cat = "EXCELLENT"
    elif pct >= 100: cat = "GOOD"
    elif pct >= 70:  cat = "AVERAGE"
    else:            cat = "POOR"

    insights = []
    if rainfall > 200:  insights.append("High rainfall — ensure proper field drainage to avoid waterlogging.")
    elif rainfall < 80: insights.append("Low rainfall — consider supplemental irrigation for better yield.")
    if temp > 35:       insights.append("High temperature stress detected — consider shade nets or early sowing.")
    elif temp < 15:     insights.append("Low temperature — risk of frost damage. Use protective covers if possible.")
    if humidity > 85:   insights.append("High humidity — monitor for fungal diseases like blight or rust.")
    elif humidity < 40: insights.append("Low humidity — increase irrigation frequency to prevent moisture stress.")

    recommendations = []
    if data['soil_type'] == 'Loamy':
        recommendations.append("Loamy soil is ideal for most crops. Maintain organic matter with compost.")
    elif data['soil_type'] == 'Acidic':
        recommendations.append("Acidic soil: Apply lime to raise pH. Target pH 6.0–6.5 for best results.")
    elif data['soil_type'] == 'Alkaline':
        recommendations.append("Alkaline soil: Add sulfur or organic matter to lower pH gradually.")
    if data['fertilizer'] == 'NPK':
        recommendations.append("NPK provides balanced N-P-K nutrition. Apply at recommended rates.")
    elif data['fertilizer'] == 'Urea':
        recommendations.append("Urea is high in nitrogen. Split application reduces nitrogen loss.")
    elif data['fertilizer'] == 'DAP':
        recommendations.append("DAP is excellent for root development. Apply at planting time.")

    risk_factors = []
    if pct < 70:
        risk_factors.append("Yield is below average — review soil health and water management.")
    if rainfall > 300:
        risk_factors.append("Excessive rainfall risk — waterlogging may damage root systems.")
    if temp > 40:
        risk_factors.append("Extreme heat risk — crop failure possible without intervention.")

    return {
        "success": True,
        "predicted_yield": round(y, 3),
        "total_yield": round(y * area, 2),
        "yield_category": cat,
        "percentage_of_baseline": round(pct, 1),
        "insights": insights,
        "recommendations": recommendations,
        "risk_factors": risk_factors,
        "input_summary": {
            "crop": data['crop_type'],
            "area_ha": area,
            "soil": data['soil_type'],
            "fertilizer": data['fertilizer'],
            "temperature": temp,
            "rainfall": rainfall,
            "humidity": humidity
        }
    }

if __name__ == '__main__':
    try:
        raw  = sys.stdin.read().strip()
        data = json.loads(raw)
        print(json.dumps(predict(data)))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
