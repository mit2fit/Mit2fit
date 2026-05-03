import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Droplets, Flame, User, Info, ArrowRight, PieChart, ShieldAlert } from 'lucide-react';

type ToolType = 'BMI' | 'CALORIES' | 'WATER' | 'BODYFAT' | 'MACROS';

export default function Tools() {
  const [activeTool, setActiveTool] = useState<ToolType>('BMI');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [nutritionGoal, setNutritionGoal] = useState<'cut' | 'maintain' | 'bulk'>('maintain');
  
  // Internal values stored in metric for calculation consistency
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(175);
  
  // Calorie & Body Fat State
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState(1.2);

  // Conversion Helpers
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
  const lbsToKg = (lbs: number) => lbs / 2.20462;
  const cmToIn = (cm: number) => Math.round(cm * 0.393701);
  const inToCm = (inches: number) => inches / 0.393701;

  const calculateBMIValue = () => {
    const heightInMeters = heightCm / 100;
    return weightKg / (heightInMeters * heightInMeters);
  };

  const calculateBMI = () => {
    return calculateBMIValue().toFixed(1);
  };

  const calculateBodyFat = () => {
    const bmi = calculateBMIValue();
    const genderFactor = gender === 'male' ? 1 : 0;
    // Deurenberg formula for adults
    const bodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
    return Math.max(0, bodyFat).toFixed(1);
  };

  const getBodyFatCategory = (bf: number) => {
    if (gender === 'male') {
      if (bf < 6) return { label: 'Essential Fat', color: 'text-blue-400' };
      if (bf < 14) return { label: 'Athlete', color: 'text-brand' };
      if (bf < 18) return { label: 'Fitness', color: 'text-brand opacity-80' };
      if (bf < 25) return { label: 'Average', color: 'text-orange-300' };
      return { label: 'Above Average', color: 'text-red-500' };
    } else {
      if (bf < 14) return { label: 'Essential Fat', color: 'text-blue-400' };
      if (bf < 21) return { label: 'Athlete', color: 'text-brand' };
      if (bf < 25) return { label: 'Fitness', color: 'text-brand opacity-80' };
      if (bf < 32) return { label: 'Average', color: 'text-orange-300' };
      return { label: 'Above Average', color: 'text-red-500' };
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { label: 'Optimal', color: 'text-brand' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-orange-300' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  const calculateTDEE = () => {
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;
    return Math.round(bmr * activity);
  };

  const calculateWater = () => {
    const liters = weightKg * 0.033;
    return unitSystem === 'metric' ? liters.toFixed(1) : (liters * 33.814).toFixed(0); // Liters to fl oz
  };

  const calculateMacros = () => {
    const tdee = calculateTDEE();
    const ratios = {
      cut: { p: 0.40, f: 0.30, c: 0.30, calAdj: -500 },
      maintain: { p: 0.30, f: 0.30, c: 0.40, calAdj: 0 },
      bulk: { p: 0.25, f: 0.25, c: 0.50, calAdj: 300 }
    }[nutritionGoal];

    const targetCalories = tdee + ratios.calAdj;
    
    return {
      calories: targetCalories,
      protein: Math.round((targetCalories * ratios.p) / 4),
      fats: Math.round((targetCalories * ratios.f) / 9),
      carbs: Math.round((targetCalories * ratios.c) / 4)
    };
  };

  return (
    <main className="pt-32 pb-16 md:pt-40 md:pb-32 bg-paper text-ink min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 md:mb-24 border-b border-edge pb-12 md:pb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em] mb-4 block">Optimization Lab</span>
              <h1 className="text-3xl sm:text-7xl md:text-9xl mb-8 tracking-tighter break-words">Performance <br /><span className="text-brand">Calculators.</span></h1>
              <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">Precision tools for biological tracking. Use these metrics as a baseline for your performance evolution.</p>
            </div>
            
            {/* Unit Toggle */}
            <div className="flex bg-surface p-1 border border-edge">
              <button 
                onClick={() => setUnitSystem('metric')}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${unitSystem === 'metric' ? 'bg-brand text-black' : 'text-zinc-500 hover:text-white'}`}
              >
                Metric
              </button>
              <button 
                onClick={() => setUnitSystem('imperial')}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${unitSystem === 'imperial' ? 'bg-brand text-black' : 'text-zinc-500 hover:text-white'}`}
              >
                Imperial
              </button>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-px bg-edge border border-edge">
            {[
              { id: 'BMI', icon: <User size={18} />, label: 'Body Mass Index' },
              { id: 'BODYFAT', icon: <Calculator size={18} />, label: 'Body Fat Est.' },
              { id: 'CALORIES', icon: <Flame size={18} />, label: 'Metabolic Rate' },
              { id: 'MACROS', icon: <PieChart size={18} />, label: 'Macro Breakdown' },
              { id: 'WATER', icon: <Droplets size={18} />, label: 'Hydration Target' },
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as ToolType)}
                className={`w-full p-6 flex items-center gap-4 text-xs font-black uppercase tracking-widest transition-all ${
                  activeTool === tool.id ? 'bg-brand text-black' : 'bg-paper text-zinc-500 hover:text-white'
                }`}
              >
                {tool.icon} {tool.label}
              </button>
            ))}
          </div>

          {/* Calculator Interface */}
          <div className="lg:col-span-9 bg-surface border border-edge p-6 md:p-16">
            <motion.div
              key={activeTool + unitSystem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
            >
              {/* Controls */}
              <div className="space-y-6 md:space-y-10">
                <div className="flex items-center gap-2 text-brand font-mono text-[10px] uppercase tracking-widest font-bold mb-4">
                  <Calculator size={14} /> Metric Configuration
                </div>
                
                {(activeTool === 'BMI' || activeTool === 'BODYFAT') && (
                  <>
                    {activeTool === 'BODYFAT' && (
                       <div className="flex gap-4 mb-8">
                        <button 
                          onClick={() => setGender('male')}
                          className={`flex-1 p-4 border text-[10px] font-black uppercase tracking-widest transition-all ${gender === 'male' ? 'border-brand text-brand bg-brand/5' : 'border-edge text-zinc-600'}`}
                        >
                          MALE
                        </button>
                        <button 
                          onClick={() => setGender('female')}
                          className={`flex-1 p-4 border text-[10px] font-black uppercase tracking-widest transition-all ${gender === 'female' ? 'border-brand text-brand bg-brand/5' : 'border-edge text-zinc-600'}`}
                        >
                          FEMALE
                        </button>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                        <span>Weight: {unitSystem === 'metric' ? `${weightKg}kg` : `${kgToLbs(weightKg)}lbs`}</span>
                        <span>Height: {unitSystem === 'metric' ? `${heightCm}cm` : `${cmToIn(heightCm)}in`}</span>
                      </div>
                      <input 
                        type="range" 
                        min={unitSystem === 'metric' ? 40 : 90} 
                        max={unitSystem === 'metric' ? 150 : 330} 
                        value={unitSystem === 'metric' ? weightKg : kgToLbs(weightKg)} 
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setWeightKg(unitSystem === 'metric' ? val : lbsToKg(val));
                        }}
                        className="w-full accent-brand" 
                      />
                      <input 
                        type="range" 
                        min={unitSystem === 'metric' ? 140 : 55} 
                        max={unitSystem === 'metric' ? 220 : 86} 
                        value={unitSystem === 'metric' ? heightCm : cmToIn(heightCm)} 
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setHeightCm(unitSystem === 'metric' ? val : inToCm(val));
                        }}
                        className="w-full accent-brand" 
                      />
                      {activeTool === 'BODYFAT' && (
                        <div className="pt-4">
                          <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500 mb-2">
                            <span>Age: {age}</span>
                          </div>
                          <input 
                            type="range" min="15" max="80" value={age} 
                            onChange={(e) => setAge(Number(e.target.value))}
                            className="w-full accent-brand" 
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTool === 'CALORIES' && (
                  <>
                    <div className="space-y-8">
                       <div className="flex gap-4">
                        <button 
                          onClick={() => setGender('male')}
                          className={`flex-1 p-4 border text-[10px] font-black uppercase tracking-widest transition-all ${gender === 'male' ? 'border-brand text-brand bg-brand/5' : 'border-edge text-zinc-600'}`}
                        >
                          MALE
                        </button>
                        <button 
                          onClick={() => setGender('female')}
                          className={`flex-1 p-4 border text-[10px] font-black uppercase tracking-widest transition-all ${gender === 'female' ? 'border-brand text-brand bg-brand/5' : 'border-edge text-zinc-600'}`}
                        >
                          FEMALE
                        </button>
                      </div>

                      <div className="space-y-4">
                         <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                          <span>Age: {age}</span>
                          <span>Activity Factor: x{activity}</span>
                        </div>
                        <input 
                          type="range" min="15" max="80" value={age} 
                          onChange={(e) => setAge(Number(e.target.value))}
                          className="w-full accent-brand" 
                        />
                        <div className="space-y-2">
                           <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                            <span>Weight: {unitSystem === 'metric' ? `${weightKg}kg` : `${kgToLbs(weightKg)}lbs`}</span>
                          </div>
                          <input 
                            type="range" 
                            min={unitSystem === 'metric' ? 40 : 90} 
                            max={unitSystem === 'metric' ? 150 : 330} 
                            value={unitSystem === 'metric' ? weightKg : kgToLbs(weightKg)} 
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setWeightKg(unitSystem === 'metric' ? val : lbsToKg(val));
                            }}
                            className="w-full accent-brand" 
                          />
                        </div>
                        <select 
                          value={activity} 
                          onChange={(e) => setActivity(Number(e.target.value))}
                          className="w-full bg-black border border-edge p-4 text-[10px] font-mono text-zinc-400 uppercase outline-none focus:border-brand"
                        >
                          <option value="1.2">Sedentary (Office Work)</option>
                          <option value="1.375">Lightly Active (1-3 days/week)</option>
                          <option value="1.55">Moderately Active (3-5 days/week)</option>
                          <option value="1.725">Very Active (6-7 days/week)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {activeTool === 'MACROS' && (
                  <>
                    <div className="space-y-8">
                       <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Select Nutrition Goal</span>
                        <div className="flex gap-2">
                          {(['cut', 'maintain', 'bulk'] as const).map((g) => (
                            <button 
                              key={g}
                              onClick={() => setNutritionGoal(g)}
                              className={`flex-1 p-3 border text-[10px] font-black uppercase tracking-widest transition-all ${nutritionGoal === g ? 'border-brand text-brand bg-brand/5' : 'border-edge text-zinc-600'}`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                          <span>Age: {age}</span>
                          <span>Weight: {unitSystem === 'metric' ? `${weightKg}kg` : `${kgToLbs(weightKg)}lbs`}</span>
                        </div>
                        <div className="flex gap-4">
                          <input 
                            type="range" min="15" max="80" value={age} 
                            onChange={(e) => setAge(Number(e.target.value))}
                            className="w-full accent-brand" 
                          />
                          <input 
                            type="range" 
                            min={unitSystem === 'metric' ? 40 : 90} 
                            max={unitSystem === 'metric' ? 150 : 330} 
                            value={unitSystem === 'metric' ? weightKg : kgToLbs(weightKg)} 
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setWeightKg(unitSystem === 'metric' ? val : lbsToKg(val));
                            }}
                            className="w-full accent-brand" 
                          />
                        </div>
                        <select 
                          value={activity} 
                          onChange={(e) => setActivity(Number(e.target.value))}
                          className="w-full bg-black border border-edge p-4 text-[10px] font-mono text-zinc-400 uppercase outline-none focus:border-brand"
                        >
                          <option value="1.2">Sedentary</option>
                          <option value="1.375">Lightly Active</option>
                          <option value="1.55">Moderately Active</option>
                          <option value="1.725">Very Active</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {activeTool === 'WATER' && (
                  <div className="space-y-6">
                    <p className="text-zinc-500 text-sm italic font-mono uppercase tracking-widest">Hydration is indexed by total body mass.</p>
                     <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500 font-bold">
                        <span>Body Weight: {unitSystem === 'metric' ? `${weightKg}kg` : `${kgToLbs(weightKg)}lbs`}</span>
                      </div>
                      <input 
                        type="range" 
                        min={unitSystem === 'metric' ? 40 : 90} 
                        max={unitSystem === 'metric' ? 150 : 330} 
                        value={unitSystem === 'metric' ? weightKg : kgToLbs(weightKg)} 
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setWeightKg(unitSystem === 'metric' ? val : lbsToKg(val));
                        }}
                        className="w-full accent-brand" 
                      />
                    </div>
                  </div>
                )}
                
                <div className="pt-8 border-t border-edge">
                  <div className="flex items-center gap-3 text-zinc-600">
                    <Info size={16} />
                    <p className="text-[9px] uppercase tracking-widest font-mono">MIT2FIT Protocols recommend tracking these metrics weekly for objective progress analysis.</p>
                  </div>
                </div>
              </div>

              {/* Display Result */}
              <div className="bg-black border border-edge p-8 md:p-12 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 -skew-x-[20deg] translate-x-1/2 -translate-y-1/2 group-hover:bg-brand/10 transition-colors" />
                
                {activeTool === 'BMI' && (
                  <>
                    <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Your BMI Estimate</h3>
                    <div className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-4">{calculateBMI()}</div>
                    <div className={`text-xl font-black uppercase tracking-tighter italic ${getBMICategory(Number(calculateBMI())).color}`}>
                      {getBMICategory(Number(calculateBMI())).label}
                    </div>
                  </>
                )}

                {activeTool === 'BODYFAT' && (
                  <>
                    <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Estimated Body Fat</h3>
                    <div className="text-6xl sm:text-8xl md:text-[7rem] font-black tracking-tighter mb-4 leading-none">{calculateBodyFat()}<span className="text-4xl text-brand shrink-0">%</span></div>
                    <div className={`text-xl font-black uppercase tracking-tighter italic ${getBodyFatCategory(Number(calculateBodyFat())).color}`}>
                      {getBodyFatCategory(Number(calculateBodyFat())).label}
                    </div>
                  </>
                )}

                {activeTool === 'CALORIES' && (
                  <>
                    <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Estimated TDEE</h3>
                    <div className="text-6xl sm:text-8xl md:text-[7rem] font-black tracking-tighter mb-4 leading-none uppercase">{calculateTDEE()}</div>
                    <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest italic">Calories / Day for Maintenance</div>
                  </>
                )}

                {activeTool === 'MACROS' && (
                  <div className="space-y-8">
                    <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Daily Targets</h3>
                    <div className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic text-brand leading-none">
                      {calculateMacros().calories} <span className="text-xl text-white not-italic opacity-40">CAL/DAY</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                       <div className="bg-paper p-4 border border-edge">
                        <div className="text-2xl font-black tracking-tighter text-white">{calculateMacros().protein}g</div>
                        <div className="text-[9px] font-mono uppercase text-zinc-500 tracking-widest">Protein</div>
                      </div>
                      <div className="bg-paper p-4 border border-edge">
                        <div className="text-2xl font-black tracking-tighter text-white">{calculateMacros().fats}g</div>
                        <div className="text-[9px] font-mono uppercase text-zinc-500 tracking-widest">Fats</div>
                      </div>
                      <div className="bg-paper p-4 border border-edge">
                        <div className="text-2xl font-black tracking-tighter text-white">{calculateMacros().carbs}g</div>
                        <div className="text-[9px] font-mono uppercase text-zinc-500 tracking-widest">Carbs</div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest leading-loose">
                        * ratios optimized for {nutritionGoal} phase
                      </p>
                    </div>
                  </div>
                )}

                {activeTool === 'WATER' && (
                   <>
                    <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Hydration Target</h3>
                    <div className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-4">{calculateWater()}</div>
                    <div className="text-xl font-black uppercase tracking-tighter italic text-brand">
                      {unitSystem === 'metric' ? 'Liters / Day' : 'Fl Oz / Day'}
                    </div>
                  </>
                )}

                <button 
                   onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
                   className="mt-12 w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border border-edge py-4 hover:border-brand hover:text-brand transition-all font-mono"
                >
                  Optimize via Consultation <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
