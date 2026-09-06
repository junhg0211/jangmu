import os

def main():
    for filename in os.listdir('.'):
        if not filename.endswith('.svg'):
            continue

        with open(filename, 'r') as f:
            content = '\n'.join(filter(lambda x: 'rect' not in x, f.read().split('\n')))
        with open(filename, 'w') as f:
            f.write(content)

        print(content)


if __name__ == '__main__':
    main()
