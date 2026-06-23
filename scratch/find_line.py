with open(r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\app\calm-zone\page.tsx", "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        if "media__1782206187950.png" in line:
            print(f"Line {idx+1}: {line.strip()}")
